
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

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

    lab.test('should return 500 if error occurs while retrieving users timecared submissions', async () => {

        const fakeUserId = '3behrfuvikmnfbh3j';
        const timecard = {
            injured: false
        };

        const getUserTimecardsStub = Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

            return {
                where() {

                    return {
                        get: Sinon.stub().returns(Promise.reject())
                    };
                }
            };
        });

        const injectOptions = {
            method: 'POST',
            url: `/submit/${fakeUserId}`,
            payload: timecard
        };

        const res = await Server.server.inject(injectOptions);

        getUserTimecardsStub.parent.restore();

        Code.expect(res.statusCode).to.equal(500);
    });
    // lab.test('should ignore request to submit a timecard if user already submitted for previous pay period', async () => {

    //     const getUserTimecardsStub = Sinon.stub(Server.db, 'collection').withArgs('timecards').callsFake(() => {

    //         return {
    //             where() {

    //                 return {
    //                     get: Sinon.stub().returns({
    //                         docs: [
    //                             {
    //                                 data: () => {

    //                                     return {
    //                                         userId: 'fake entry Data',
    //                                         injured: false,
    //                                         startDate: new Date(),
    //                                         endDate: new Date()
    //                                     };
    //                                 }
    //                             }
    //                         ]
    //                     })
    //                 };
    //             }
    //         };
    //     });

    //     const fakeUserId = 'ijhgy783i4rfivuhd';

    //     const timecard = {
    //         userId: fakeUserId,
    //         injured: false
    //     };

    //     const injectOptions = {
    //         method: 'POST',
    //         url: '/submit',
    //         payload: timecard
    //     };

    //     const res = await Server.server.inject(injectOptions);

    //     getUserTimecardsStub.parent.restore();

    //     Sinon.assert.calledOnce(getUserTimecardsStub);
    //     Code.expect(res.statusCode).to.equal(200);
    // });
});


