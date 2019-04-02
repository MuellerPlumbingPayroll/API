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

        const missingAttrs = { email: 'qwerty12345@gmail.com' };

        const injectOptions = {
            method: 'POST',
            url: '/users',
            payload: missingAttrs
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should successfully add a new user if payload is validated.', async () => {

        const fakeNewUser = { email: 'fakeUser@gmail.com', firstName: 'Bob', lastName: 'Builder', isActive: true };

        // Stub adding a user to firebase
        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {

                add: Sinon.stub()
            };
        });

        const injectOptions = {
            method: 'POST',
            url: '/users',
            payload: fakeNewUser
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201); // Expect Created HTTP response
    });

    lab.test('should successfully updated an existing user if payload is validated', async () => {

        const fakeExistingUser = { email: 'fakeUser@gmail.com', firstName: 'Bob', lastName: 'Builder', isActive: false };
        const fakeUserId = '7ujhgyujnbhdjsfg4wraf';

        // Stub adding a user to firebase
        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        update: Sinon.stub()
                    };
                }
            };
        });

        const injectOptions = {
            method: 'POST',
            url: `/users/${fakeUserId}`,
            payload: fakeExistingUser
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
