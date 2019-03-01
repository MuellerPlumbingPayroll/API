const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();

lab.experiment('When requesting cost-codes', () => {

    lab.test('should successfully retrieve cost-codes from firebase', async () => {

        const expected =
            [
                {
                    id: 111,
                    docData:'this is fake data'

                },
                {
                    id: 222,
                    docData: 'more fake data'

                }
            ];

        const snapshotStub = Sinon.stub(Server.db, 'collection').callsFake(() => {

            return {
                get: Sinon.stub().returns({
                    docs: [
                        {
                            id: 111,
                            data: () => {

                                return { docData: 'this is fake data' };
                            }
                        },
                        {
                            id: 222,
                            data: () => {

                                return { docData: 'more fake data' };
                            }
                        }
                    ]
                })
            };
        });

        const res = await Server.server.inject('/cost-code');

        snapshotStub.restore();

        Sinon.assert.calledOnce(snapshotStub);
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(JSON.parse(res.payload)).to.equal(expected);
    });

    lab.test('should return 500 if retrieving cost-codes fails', async () => {

        const snapshotStub = Sinon.stub(Server.db, 'collection').resolves(() => {

            return {
                get: Sinon.stub().returns(Promise.reject())
            };
        });

        const res = await Server.server.inject('/cost-code');
        snapshotStub.restore();

        Code.expect(res.statusCode).to.equal(500);
    });
});

lab.experiment('When adding cost-codes', () => {

    lab.test('should return 400 status code if payload is missing code attribute.', async () => {

        const missingCodePayLoad = { description: 'fake description.' };

        const injectOptions = {
            method: 'POST',
            url: '/cost-code',
            payload: missingCodePayLoad
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should successfully add cost-code if payload is valid.', async () => {

        const fakeCostCode = { code: 9999, description: 'fake code description.' };

        // Stub adding a cost-code to firebase
        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('cost-codes').callsFake(() => {

            return {

                doc() {

                    return {

                        set: Sinon.stub()
                    };
                }
            };
        });

        const injectOptions = {
            method: 'POST',
            url: '/cost-code',
            payload: fakeCostCode
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201); // Expect Created HTTP response
    });
});
