
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const UtilsDB = require('../../src/utils/database');

const lab = exports.lab = Lab.script();


lab.experiment('When submitting a timecard', () => {

    lab.test('should return 400 status code if payload is not validated', async () => {

        const fakeUserId = 'uedifjhy4uirfjncjd';

        const invalidPayload = {}; // payload is missing required injured field

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: invalidPayload
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should return 500 if error occurs when checking if user exists', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.reject();
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should update submission for current pay period if user does not have time entries for previous pay period', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return { empty: true };
        });

        const getSubmissionStub = Sinon.stub(UtilsDB, 'getSubmission').callsFake(() => {

            return {};
        });

        const updateStub =  Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                doc() {

                    return {
                        update: Sinon.stub().resolves
                    };
                }
            };
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test',
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        updateStub.parent.restore();
        getSubmissionStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(getSubmissionStub);
        Code.expect(res.statusCode).to.equal(200);
    });

    lab.test('should update submission for current pay period if user has time entries for previous pay period', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return { empty: false };
        });

        const getSubmissionStub = Sinon.stub(UtilsDB, 'getSubmission').callsFake(() => {

            return {};
        });

        const currentPPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return true;
        });

        const updateStub =  Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                doc() {

                    return {
                        update: Sinon.stub().resolves
                    };
                }
            };
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        currentPPSubmittedStub.restore();
        updateStub.parent.restore();
        getSubmissionStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(getSubmissionStub);
        Sinon.assert.calledOnce(currentPPSubmittedStub);
        Code.expect(res.statusCode).to.equal(200);
    });

    lab.test('should add a new submission for current pay period if user does not have time entries for previous pay period', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return { empty: true };
        });

        const getSubmissionStub = Sinon.stub(UtilsDB, 'getSubmission').callsFake(() => {

            return null;
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const submitTimecardStub = Sinon.stub(UtilsDB, 'submitTimecard').callsFake(() => {

            return timecard;
        });

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        submitTimecardStub.restore();
        getSubmissionStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(getSubmissionStub);
        Code.expect(res.statusCode).to.equal(201);
    });

    lab.test('should add a new submission for current pay period if user does not have time entries for previous pay period', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return { empty: false };
        });

        const getSubmissionStub = Sinon.stub(UtilsDB, 'getSubmission').callsFake(() => {

            return null;
        });

        const prevPPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return true;
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const submitTimecardStub = Sinon.stub(UtilsDB, 'submitTimecard').callsFake(() => {

            return timecard;
        });

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        prevPPSubmittedStub.restore();
        submitTimecardStub.restore();
        getSubmissionStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(getSubmissionStub);
        Sinon.assert.calledOnce(prevPPSubmittedStub);
        Code.expect(res.statusCode).to.equal(201);
    });


    lab.test('should submit for the previous pay period.', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return true;
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return { empty: false };
        });

        const prevPPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return false;
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const submitTimecardStub = Sinon.stub(UtilsDB, 'submitTimecard').callsFake(() => {

            return timecard;
        });

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        prevPPSubmittedStub.restore();
        submitTimecardStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(prevPPSubmittedStub);
        Code.expect(res.statusCode).to.equal(201);
    });
});

lab.experiment('When requesting timecards for a pay period', () => {

    lab.test('should return 500 if an error occurs while get a users info', async () => {

        const getUserStub = Sinon.stub(UtilsDB, 'getUser').callsFake(() => {

            return Promise.reject();
        });

        const userIds = JSON.stringify(['ijhbhjikmnhjk34rt']);
        const startDate = new Date();
        const endDate = new Date();

        const injectOptions = {
            method: 'GET',
            url: `/timecards/${userIds}/${startDate}/${endDate}`,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        getUserStub.restore();
        Sinon.assert.calledOnce(getUserStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    // lab.test('should return a timecard for a single users', async () => {

    //     const getUserStub = Sinon.stub(UtilsDB, 'getUser').callsFake(() => {

    //         return { firstName: 'Jon', lastName: 'Snow' };
    //     });

    //     const now = new Date();

    //     const timeEntryInfo = {
    //         jobType: 'Other',
    //         job: 'Vacation',
    //         timeWorked: 3,
    //         jobDate: now,
    //         latitude: null,
    //         longitude: null
    //     };

    //     const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

    //         return Promise.resolve({
    //             empty: false,
    //             docs: [
    //                 {
    //                     id: '38edufjhryu',
    //                     data: () => {

    //                         return {
    //                             jobType: 'Other',
    //                             job: 'Vacation',
    //                             timeWorked: 3,
    //                             jobDate: now,
    //                             costCode: null,
    //                             latitude: null,
    //                             longitude: null
    //                         };
    //                     }
    //                 }
    //             ]
    //         });
    //     });

    //     const getSubmissionStub = Sinon.stub(UtilsDB, 'getSubmission').callsFake(() => {

    //         return Promise.resolve({ injured: false });
    //     });

    //     const userIds = ['lknhjknjklkmnjsdf24'];
    //     const startDate = new Date();
    //     const endDate = new Date();

    //     const injectOptions = {
    //         method: 'GET',
    //         url: `/timecards/${userIds}/${startDate}/${endDate}`
    //     };

    //     const res = await Server.server.inject(injectOptions);

    //     getUserStub.restore();
    //     entriesSnapshotStub.restore();
    //     getSubmissionStub.restore();

    //     Sinon.assert.calledOnce(getUserStub);
    //     Sinon.assert.calledOnce(entriesSnapshotStub);
    //     Sinon.assert.calledOnce(getSubmissionStub);

    //     Code.expect(res.statusCode).to.equal(200);

    //     // TypeError: entry.jobDate.toDate is not a function... probably because jobDate is a Timestamp.
    // });
});


