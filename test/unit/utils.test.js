const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const UtilsDB = require('../../src/utils/database');
const UtilsPP = require('../../src/utils/payperiod');
const UtilsCronJob = require('../../src/utils/cron-job');

const lab = exports.lab = Lab.script();

lab.experiment('When checking if a user exists', () => {

    lab.test('should return true if user is found', async () => {

        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns({ exists: true })
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';
        const res = await UtilsDB.userExists(fakeId);

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
        Code.expect(res).to.equal(true);
    });

    lab.test('should return false if a user is not found', async () => {

        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns({ exists: false })
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';
        const res = await UtilsDB.userExists(fakeId);

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
        Code.expect(res).to.equal(false);
    });

    lab.test('should return an error if getting user fails', async () => {

        const fakeError = new Error('Fake server error.');
        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns(Promise.reject(fakeError))
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';

        try {
            await UtilsDB.userExists(fakeId);
        }
        catch (err) {
            Code.expect(err).to.equal(fakeError);
        }

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
    });
});

lab.experiment('When calculating pay periods', () => {

    lab.test('current pay period should start on wednesday and end a tuesday', async () => {

        const wednesday = 3;
        // const tuesday = 2;
        const res = await UtilsPP.currentPayPeriod();
        Code.expect(res.startDate.getDay()).to.equal(wednesday);
        // Code.expect(res.endDate.getDay()).to.equal(tuesday); ... timezone diff with travis loc


    });
});

lab.experiment('When using utils in api/submit', () => {

    lab.test('should submit a timecard sucessfully if no errors occur', async () => {


        const testPP = UtilsPP.currentPayPeriod();
        const fakeUserId = 'oijhg485irtergj';
        const submission = { injured: false };
        submission.userId = fakeUserId;
        submission.starDate = testPP.starDate;
        submission.endDate = testPP.endDate;

        const addTimecardStub = Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                add: Sinon.stub().returns(Promise.resolve(submission))
            };
        });

        const res = await UtilsDB.submitTimecard(fakeUserId, testPP, submission);

        addTimecardStub.parent.restore();
        Code.expect(res).to.equal(submission);
    });

    lab.test('should return entries for a pay period if no erros occur.', async () => {

        const entriesSnapshotStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                where() {

                                    return {
                                        where() {

                                            return {
                                                get: Sinon.stub().returns(Promise.resolve({ })) // No entries
                                            };
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });


        const testPP = UtilsPP.currentPayPeriod();
        const fakeUserId = 'oijhg485irtergj';
        const res = await UtilsDB.getEntriesForPayPeriod(fakeUserId, testPP);

        entriesSnapshotStub.parent.restore();

        Code.expect(res).to.equal({ });

    });

    lab.test('should successfully return if a timecard for a given pay period has been submitted', async () => {

        const timecardSnapshotStub = Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {

                where() {

                    return {
                        where() {

                            return {
                                where() {

                                    return {
                                        get: Sinon.stub().returns({ empty: true }) // No entries
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const testPP = UtilsPP.currentPayPeriod();
        const fakeUserId = 'oijhg485irtergj';
        const res = await UtilsDB.payPeriodSubmitted(fakeUserId, testPP);

        timecardSnapshotStub.parent.restore();

        Code.expect(res).to.equal(false);
    });
});

lab.experiment('When /timecards', () => {

    lab.test('should return document for existing user', async () => {

        const userSnapshotStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns({
                            exists: true,
                            data: () => {

                                return { docData: 'oinjikjn' };
                            }
                        })
                    };
                }
            };
        });

        const testId = 'lknbuik3n4jrkf';
        const res = await UtilsDB.getUser(testId);

        userSnapshotStub.parent.restore();

        Sinon.assert.calledOnce(userSnapshotStub);
        Code.expect(res.docData).to.equal('oinjikjn');
    });

    lab.test('should return a timecard submission', async () => {

        const submissionSnapshotStub =  Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                where() {

                    return {
                        where() {

                            return {
                                where() {

                                    return {
                                        get: Sinon.stub().returns({
                                            empty: false,
                                            docs: [
                                                {
                                                    id: 'oiuyijnbrenijd',
                                                    data: () => {

                                                        return { docData: 'we908fudsinv' };
                                                    }
                                                }
                                            ]
                                        })
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const testId = 'lknbuik3n4jrkf';
        const testPeriod =  { startDate: new Date(), endDate: new Date() };
        const res = await UtilsDB.getSubmission(testId, testPeriod);

        submissionSnapshotStub.parent.restore();
        Code.expect(res.id).to.equal('oiuyijnbrenijd');
    });

    lab.test('should return null if timecard does not exist', async () => {

        const submissionSnapshotStub =  Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                where() {

                    return {
                        where() {

                            return {
                                where() {

                                    return {
                                        get: Sinon.stub().returns({
                                            empty: true
                                        })
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const testId = 'lknbuik3n4jrkf';
        const testPeriod =  { startDate: new Date(), endDate: new Date() };
        const res = await UtilsDB.getSubmission(testId, testPeriod);

        submissionSnapshotStub.parent.restore();
        Code.expect(res).to.equal(null);
    });
});

lab.experiment('When executing cron jobs', () => {

    lab.test('should get user ids for inactive users', async () => {

        const snapshotStub =  Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                where() {

                    return {
                        where() {

                            return {
                                get: Sinon.stub().returns({
                                    empty: true
                                })
                            };
                        }
                    };
                }
            };
        });

        const res = await UtilsCronJob.getInactiveUserIds();

        snapshotStub.parent.restore();
        Code.expect(res).to.equal([]);
    });

    lab.test('should remove a user if no errors occur', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        delete: Sinon.stub().returns([])
                    };
                }
            };
        });

        const testUserId = 'pokjhgft6uikm';
        const res = await UtilsCronJob.removeUser(testUserId);

        deleteStub.parent.restore();
        Code.expect(res).to.equal();

    });

    lab.test('should get ids for all users if no errors occur', async () => {

        const fakeIds = ['oiuyijnbrenijd', 'iuybghuijknhb'];
        const fakeSnapshot = {
            empty: false,
            docs: [
                {
                    id: fakeIds[0]
                },
                {
                    id: fakeIds[1]
                }
            ]
        };
        const getStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                get: Sinon.stub().returns(fakeSnapshot)
            };
        });

        const testUserId = 'pokjhgft6uikm';
        const res = await UtilsCronJob.getUserIds(testUserId);

        getStub.parent.restore();
        Code.expect(res).to.equal(fakeIds);

    });
});
