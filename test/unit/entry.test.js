
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();


lab.experiment('When adding an entry', () => {

    lab.test('should return 400 status code if payload is missing entry attributes.', async () => {

        // Missing time keys
        const missingAttrsPayLoad = {
            id: 'ijhgyujnh3456tfds',
            userId: 'fakeUser',
            jobType: 'Other',
            jobDescription: 'clogged fake toilet',
            costCode: 'fake code'
        };

        const injectOptions = {
            method: 'POST',
            url: '/entry',
            payload: missingAttrsPayLoad
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should return 400 status code if values do not match entry shema', async () => {

        const created = '2015-01-01T15:23:42';
        const updated = '2016-01-01T15:23:42';

        const malformedAttrs = {
            id: 'ijhgyujnh3456tfds',
            userId: 1234, // should be a string
            jobType: 'Other',
            jobDescription: 'clogged fake toilet',
            costCode: 'fake code',
            timeWorked: 4,
            timeCreated: created,
            timeUpdated: updated,
            latitudeCreated: 85,
            latitudeUpdated: 85,
            longitudeCreated: -177,
            longitudeUpdated: -160
        };

        const injectOptions = {
            method: 'POST',
            url: '/entry',
            payload: malformedAttrs
        };

        const res = await Server.server.inject(injectOptions);
        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should successfully add time entry if payload is valid', async () => {

        const firebaseStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                doc() {

                                    return {
                                        set: Sinon.stub()
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const created = '2015-01-01T15:23:42';
        const updated = '2016-01-01T15:23:42';

        const timeEntry = {
            id: '34rfdergfd',
            userId: 'fakeUser',
            jobType: 'Other',
            jobDescription: 'fake job',
            costCode: '22-222',
            timeWorked: 3,
            timeCreated: created,
            timeUpdated: updated
        };

        const injectOptions = {
            method: 'POST',
            url: '/entry',
            payload: timeEntry
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201);
    });
});

lab.experiment('when retrieving entries', () => {

    lab.test('should return 500 status code if error occurs', async () => {

        const getEntriesStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

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
            method: 'GET',
            url: '/entries/fakeUserId'
        };

        const res = await Server.server.inject(injectOptions);

        getEntriesStub.parent.restore();

        Sinon.assert.calledOnce(getEntriesStub);
        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should successfully return entries', async () => {

        const getEntriesStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

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

        });

        const injectOptions = {
            method: 'GET',
            url: '/entries/fakeUserId'
        };

        const res = await Server.server.inject(injectOptions);

        getEntriesStub.parent.restore();

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

        const injectOptions = {
            method: 'DELETE',
            url: '/entry/fakeEntryId/fakeUserId'
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

        const injectOptions = {
            method: 'DELETE',
            url: '/entry/fakeEntryId/fakeUserId'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(200);
    });
});
