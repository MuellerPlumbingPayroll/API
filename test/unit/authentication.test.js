const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();

lab.experiment('When authenticating email', () => {

    lab.test('should successfully return userId if email is authenticated', async () => {


        const authenticatedUserId = 'fakeUserId1';
        const emailToAuthenticate = 'fake11@gmail.com';

        const userRefsStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

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

        const res = await Server.server.inject(`/authenticate/${emailToAuthenticate}`);

        userRefsStub.parent.restore();

        Sinon.assert.calledOnce(userRefsStub);
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(res.payload).to.equal(authenticatedUserId);
    });

    lab.test('should return 401 if email belongs to a user, but user is not active', async () => {

        const emailToAuthenticate = 'fake11@gmail.com';

        const userRefsStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                get: Sinon.stub().returns({
                    docs: [
                        {
                            id: 'fakeUserId1',
                            data: () => {

                                return {
                                    email: emailToAuthenticate,
                                    isActive: false
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

        const res = await Server.server.inject(`/authenticate/${emailToAuthenticate}`);
        userRefsStub.parent.restore();

        Sinon.assert.calledOnce(userRefsStub);
        Code.expect(res.statusCode).to.equal(401);
    });

    lab.test('should return 500 if error occurs while getting users', async () => {

        const emailToAuthenticate = 'fake11@gmail.com';

        const userRefsStub = Sinon.stub(Server.db, 'collection').withArgs('users').resolves(() => {

            return {
                get: Sinon.stub().returns(Promise.reject())
            };
        });

        const res = await Server.server.inject(`/authenticate/${emailToAuthenticate}`);
        userRefsStub.parent.restore();

        Code.expect(res.statusCode).to.equal(500);
    });
});
