
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const UtilsDB = require('../../src/utils/database');
const UtilsPP = require('../../src/utils/payperiod');

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
            payload: timecard
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();

        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should ignore request if user has submitted current pay period and does not have time entries for previous pay period.', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.resolve(true);
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return Promise.resolve({ empty: true });
        });

        const currentPPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return Promise.resolve(true);
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard
        };

        const res = await Server.server.inject(injectOptions);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        currentPPSubmittedStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledOnce(currentPPSubmittedStub);
        Code.expect(res.statusCode).to.equal(200);
    });

    lab.test('should ignore submit if previous and current pay period submitted otherwise.', async () => {

        const userExistsStub = Sinon.stub(UtilsDB, 'userExists').callsFake(() => {

            return Promise.resolve(true);
        });

        const entriesSnapshotStub = Sinon.stub(UtilsDB, 'getEntriesForPayPeriod').callsFake(() => {

            return Promise.resolve({ empty: false });
        });

        let PPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return Promise.resolve(true);
        });

        const prevPP = await UtilsPP.lastPayPeriod();

        const lastPayPeriodStub = Sinon.stub(UtilsPP, 'lastPayPeriod').callsFake(() => {

            return prevPP;
        });

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const submitTimecardStub = Sinon.stub(UtilsDB, 'submitTimecard').callsFake(() => {

            return Promise.resolve(timecard);
        });

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard
        };

        const res = await Server.server.inject(injectOptions);

        PPSubmittedStub.restore();

        Sinon.assert.calledOnce(userExistsStub);
        Sinon.assert.calledOnce(entriesSnapshotStub);
        Sinon.assert.calledTwice(PPSubmittedStub);
        Code.expect(res.statusCode).to.equal(200);

        PPSubmittedStub = Sinon.stub(UtilsDB, 'payPeriodSubmitted').callsFake(() => {

            return Promise.resolve(false);
        });

        // Submit for previous pay period
        const res2 = await Server.server.inject(injectOptions);

        Code.expect(res2.statusCode).to.equal(201);

        userExistsStub.restore();
        entriesSnapshotStub.restore();
        PPSubmittedStub.restore();
        lastPayPeriodStub.restore();
        submitTimecardStub.restore();
    });
});


