/* eslint-disable no-console */

const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();


lab.experiment('inject requests with server.inject', () => {

    lab.test('injects a request to a hapi server without a route', async () => {

        const res = await Server.server.inject('/test');
        Code.expect(res.statusCode).to.equal(200);
    });
});


lab.experiment('inject cost-code requests', () => {

    lab.test('successfully retrieve cost-codes from firebase', async () => {

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

        const res = await Server.server.inject('/cost-code/');

        snapshotStub.restore();

        Sinon.assert.calledOnce(snapshotStub);
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(JSON.parse(res.payload)).to.equal(expected);
    });

    lab.test('retrieving cost-codes fails', async () => {

        const snapshotStubbb = Sinon.stub(Server.db, 'collection').resolves(() => {

            return {
                get: Sinon.stub().returns(Promise.reject())
            };
        });

        const res = await Server.server.inject('/cost-code/');
        snapshotStubbb.restore();

        Code.expect(res.statusCode).to.equal(500);


    });
});
