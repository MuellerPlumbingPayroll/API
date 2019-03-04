const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();

lab.experiment('When requesting jobs', () => {

    lab.test('should successfully retrieve jobs from firebase', async () => {

        const expected =
            [
                {
                    id: 'qwer234',
                    docData:'job data'

                },
                {
                    id: 'otherjobid',
                    docData: 'other job data'

                }
            ];

        const snapshotStub = Sinon.stub(Server.db, 'collection').callsFake(() => {

            return {
                get: Sinon.stub().returns({
                    docs: [
                        {
                            id: 'qwer234',
                            data: () => {

                                return { docData: 'job data' };
                            }
                        },
                        {
                            id: 'otherjobid',
                            data: () => {

                                return { docData: 'other job data' };
                            }
                        }
                    ]
                })
            };
        });

        const res = await Server.server.inject('/jobs');

        snapshotStub.restore();

        Sinon.assert.calledOnce(snapshotStub);
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(JSON.parse(res.payload)).to.equal(expected);
    });

    lab.test('should return 500 if retrieving jobs fails', async () => {

        const snapshotStub = Sinon.stub(Server.db, 'collection').resolves(() => {

            return {
                get: Sinon.stub().returns(Promise.reject())
            };
        });

        const res = await Server.server.inject('/jobs');
        snapshotStub.restore();

        Code.expect(res.statusCode).to.equal(500);
    });
});

lab.experiment('When adding jobs', () => {

    lab.test('should return 400 status code if payload is missing required attributes.', async () => {

        const missingRequired = [{ address: '3093 Test St.' }, { email: 'test@email.com' }]; // payload should be an array of jobs

        const injectOptions = {
            method: 'POST',
            url: '/jobs',
            payload: missingRequired
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should successfully add new jobs if payload is validated.', async () => {

        const fakeJobs = [
            { id: null, clientName: 'Bob', address: '3498 Test St.', isActive: true },
            { id: null, clientName: 'John', address: '876 Qwerty Ave.', isActive: true }
        ];

        const addStub = Sinon.stub(Server.db, 'collection').withArgs('jobs').callsFake(() => {

            return {
                add: Sinon.stub()
            };
        });

        const injectOptions = {
            method: 'POST',
            url: '/jobs',
            payload: fakeJobs
        };

        const res = await Server.server.inject(injectOptions);

        addStub.parent.restore();

        Sinon.assert.calledTwice(addStub);
        Code.expect(res.statusCode).to.equal(200); // Expect OK HTTP response
    });

    lab.test('should successfully update an existing job if payload is validated', async () => {

        const fakeJobs = [
            { id: '9iuygfre456df2e', clientName: 'Bob', address: '3498 Test St.', isActive: true },
            { id: '09876trfcvbghy6', clientName: 'John', address: '876 Qwerty Ave.', isActive: true }
        ];

        const updateStub = Sinon.stub(Server.db, 'collection').withArgs('jobs').callsFake(() => {

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
            url: '/jobs',
            payload: fakeJobs
        };

        const res = await Server.server.inject(injectOptions);

        updateStub.parent.restore();

        Sinon.assert.calledTwice(updateStub);
        Code.expect(res.statusCode).to.equal(200); // Expect OK HTTP response
    });
});

lab.experiment('when deleting jobs', () => {

    lab.test('should return 500 status code if an error occurs', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('jobs').callsFake(() => {

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
            url: '/jobs/fakeId'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Code.expect(res.statusCode).to.equal(500);
    });

    lab.test('should successfully delete a job', async () => {

        const deleteStub = Sinon.stub(Server.db, 'collection').withArgs('jobs').callsFake(() => {

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
            url: '/jobs/fakeId'
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Code.expect(res.statusCode).to.equal(200);
    });
});
