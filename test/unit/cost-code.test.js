const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();

const mockId = () => {

    const authenticatedUserId = 'fakeUserId1';
    const emailToAuthenticate = 'fake11@gmail.com';

    Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

        return {
            get: Sinon.stub().returns({
                docs: [
                    {
                        id: authenticatedUserId,
                        data: () => {

                            return {
                                email: emailToAuthenticate,
                                isActive: true
                            };
                        }
                    },
                    {
                        id: 'fakeUserId2',
                        data: () => {

                            return {
                                email: 'fake12@gmail.com',
                                isActive: false
                            };
                        }
                    }
                ]
            })
        };
    });
    Sinon.stub(Server.auth, 'verifyIdToken').withArgs('testkey').callsFake(() => {

        return {
            email: emailToAuthenticate
        };
    });

};

const restoreId = () => {

    Sinon.restore();
};


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
        const injectOptions = {
            method: 'GET',
            url: '/cost-code',
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

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
        const injectOptions = {
            url: '/cost-code',
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);
        snapshotStub.restore();

        Code.expect(res.statusCode).to.equal(500);
    });
});

lab.experiment('When adding cost-codes', () => {

    lab.test('should return 400 status code if payload is missing code attribute.', async () => {

        mockId();
        const missingCodePayLoad = { description: 'fake description.' };

        const injectOptions = {
            method: 'POST',
            url: '/cost-code',
            payload: missingCodePayLoad,
            headers: { authorization:'Bearer testkey' } //Do Not change Testing Auth

        };

        const res = await Server.server.inject(injectOptions);
        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
        restoreId();
    });

    lab.test('should successfully add cost-code if payload is valid.', async () => {

        const fakeCostCode = { code: '22-100', codeGroup: 'code group 44', description: 'fake code description.' };

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
            payload: fakeCostCode,
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201); // Expect Created HTTP response
    });
});

lab.experiment('when deleting a cost-code', () => {

    lab.test('should return 500 status code if error occurs', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('cost-codes').callsFake(() => {

            return {
                doc() {

                    return {
                        delete: Sinon.stub().returns(Promise.reject())
                    };
                }
            };
        });

        const injectOptions = {
            method: 'DELETE',
            url: '/cost-code/fakeCodeId',
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should return OK status code if cost-code deleted successfully', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('cost-codes').callsFake(() => {

            return {
                doc() {

                    return {
                        delete: Sinon.stub().returns(Promise.resolve())
                    };
                }
            };
        });

        const injectOptions = {
            method: 'DELETE',
            url: '/cost-code/fakeCodeId',
            credentials :'test'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(200);
    });
});
