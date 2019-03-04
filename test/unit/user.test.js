const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();

lab.experiment('When requesting users', () => {

    lab.test('should successfully retrieve users from firebase', async () => {

        const expected =
            [
                {
                    id: 'qwerty12345',
                    docData:'fake user data'

                },
                {
                    id: '12345qwerty',
                    docData: 'fake user data'

                }
            ];

        const snapshotStub = Sinon.stub(Server.db, 'collection').callsFake(() => {

            return {
                get: Sinon.stub().returns({
                    docs: [
                        {
                            id: 'qwerty12345',
                            data: () => {

                                return { docData: 'fake user data' };
                            }
                        },
                        {
                            id: '12345qwerty',
                            data: () => {

                                return { docData: 'fake user data' };
                            }
                        }
                    ]
                })
            };
        });

        const res = await Server.server.inject('/users');

        snapshotStub.restore();

        Sinon.assert.calledOnce(snapshotStub);
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(JSON.parse(res.payload)).to.equal(expected);
    });

    lab.test('should return 500 if retrieving users fails', async () => {

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

lab.experiment('When adding a user', () => {

    lab.test('should return 400 status code if payload is missing required attributes.', async () => {

        const missingCodePayLoad = { googleToken: 'qwerty12345' };

        const injectOptions = {
            method: 'POST',
            url: '/users',
            payload: missingCodePayLoad
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should successfully add user if payload is validated.', async () => {

        const fakeCostCode = { email: 'fakeUser@gmail.com', isActive: true };

        // Stub adding a user to firebase
        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {

                add: Sinon.stub()
            };
        });

        const injectOptions = {
            method: 'POST',
            url: '/users',
            payload: fakeCostCode
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201); // Expect Created HTTP response
    });
});

lab.experiment('when deleting a user', () => {

    // lab.test('should delete user if user exists', async () => {

    //     const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

    //         return {
    //             doc() {

    //                 return {
    //                     delete: Sinon.stub()
    //                 };
    //             }
    //         };
    //     });

    //     const injectOptions = {
    //         method: 'DELETE',
    //         url: '/users/fakeUserId'
    //     };

    //     const res = await Server.server.inject(injectOptions);

    //     firebaseStub.parent.restore();

    //     Sinon.assert.calledOnce(firebaseStub);
    //     Code.expect(res.statusCode).to.equal(200);
    // });

    lab.test('should return 500 if an error occurs while deleting user', async () => {

        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                get: Sinon.stub().returns(Promise.reject())
                            };
                        }
                    };
                }
            };
        });

        const injectOptions = {
            method: 'DELETE',
            url: '/users/fakeUserId'
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(500);
    });
});
