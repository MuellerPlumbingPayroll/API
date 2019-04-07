
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const UtilsDB = require('../../src/utils/database');

const lab = exports.lab = Lab.script();


lab.experiment('When adding an entry', () => {

    lab.test('should return 400 status code if payload is not validated', async () => {

        const fakeUserId = 'uedifjhy4uirfjncjd';

        const invalidPayload = { // payload is missing required attributes
            jobType: 'Other',
            jobDescription: 'clogged fake toilet',
            costCode: 'fake code'
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}`,
            payload: invalidPayload,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });


    lab.test('should successfully add a new time entry if payload is validated', async () => {

        const newEntryId = '39erufhjkdejh4g';
        const addEntryStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                add: Sinon.stub().returns(newEntryId)
                            };
                        }
                    };
                }
            };
        });

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.resolve(true);
        });

        const now = new Date();
        const fakeUserId = 'ijhgy783i4rfivuhd';

        const timeEntryInfo = {
            jobType: 'Construction',
            job: {
                id: 'jhbhuikjnbgu34',
                jobNumber: '111-1111',
                clientName: '9d8cuytytu4j',
                address: '4444 2nd Ave',
                isActive: true
            },
            timeWorked: 3,
            jobDate: now,
            latitude: null,
            longitude: null
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}`,
            payload: timeEntryInfo,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        addEntryStub.parent.restore();
        userExistsStub.restore();

        Sinon.assert.calledOnce(addEntryStub);
        Code.expect(res.statusCode).to.equal(201);
    });

    lab.test('should successfully update an existing entry if payload is validated', async () => {

        const updateEntryStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                doc() {

                                    return {
                                        update: Sinon.stub()
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.resolve(true);
        });

        const now = new Date();
        const fakeUserId = 'ijhgy783i4rfivuhd';
        const fakeEntryId = 's8cxutv7e8riuktht';

        const timeEntryInfo = {
            jobType: 'Other',
            job: 'Vacation',
            timeWorked: 3,
            jobDate: now,
            latitude: null,
            longitude: null
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}/${fakeEntryId}`,
            payload: timeEntryInfo,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        updateEntryStub.parent.restore();
        userExistsStub.restore();

        Sinon.assert.calledOnce(updateEntryStub);
        Code.expect(res.statusCode).to.equal(201);

    });
});

lab.experiment('when retrieving entries', () => {

    lab.test('should return 404 if userId param does not belong to an existing user', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return false;
        });

        const fakeUserId = '93nmflkajsdf';

        const injectOptions = {
            method: 'GET',
            url: `/entries/${fakeUserId}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();

        Code.expect(res.statusCode).to.equal(404);
    });

    lab.test('should return 500 status code if error occurs', async () => {

        const getEntriesStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                where() {

                                    return {
                                        get: Sinon.stub().returns(Promise.reject())
                                    };
                                }

                            };
                        }
                    };
                }
            };
        });

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const fakeUserId = '93nmflkajsdf';

        const injectOptions = {
            method: 'GET',
            url: `/entries/${fakeUserId}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        getEntriesStub.parent.restore();
        userExistsStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(getEntriesStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should successfully return current pay period entries for a user', async () => {

        const getEntriesStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {

                                where() {

                                    return {
                                        get: Sinon.stub().returns({
                                            docs: [
                                                {
                                                    id: '38edufjhryu',
                                                    data: () => {

                                                        return { docData: 'fake entry Data' };
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

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const fakeUserId = '93nmflkajsdf';

        const injectOptions = {
            method: 'GET',
            url: `/entries/${fakeUserId}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        getEntriesStub.parent.restore();
        userExistsStub.restore();

        Sinon.assert.calledOnce(getEntriesStub);
        Code.expect(res.statusCode).to.equal(200);
    });
});

lab.experiment('when deleting an entry', () => {

    lab.test('should return 500 status code if error occurs', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                doc() {

                                    return {
                                        delete: Sinon.stub().returns(Promise.reject())
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const fakeEntryId = 'ijdhuejwrt98u';
        const fakeUserId = 'wjneroi3j45fve';

        const injectOptions = {
            method: 'DELETE',
            url: `/entry/${fakeUserId}/${fakeEntryId}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should return 200 status code if no errors occur', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                doc() {

                                    return {
                                        delete: Sinon.stub().returns(Promise.resolve())
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.resolve(true);
        });

        const fakeEntryId = 'ijdhuejwrt98u';
        const fakeUserId = 'wjneroi3j45fve';

        const injectOptions = {
            method: 'DELETE',
            url: `/entry/${fakeUserId}/${fakeEntryId}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();
        userExistsStub.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(200);
    });
});
