
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');

const lab = exports.lab = Lab.script();


lab.experiment('When adding an entry', () => {

    lab.test('should return 400 status code if payload is not validated', async () => {

        const fakeUserId = 'uedifjhy4uirfjncjd';

        const invalidPayload = { // payload is missing required attributes
            jobType: 'Other',
            jobDescription: 'clogged fake toilet',
            costCode: 'fake code'
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}`,
            payload: invalidPayload
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });


    lab.test('should successfully add a new time entry if payload is validated', async () => {

        const addEntryStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                add: Sinon.stub()
                            };
                        }
                    };
                }
            };
        });

        const now = new Date();
        const fakeUserId = 'ijhgy783i4rfivuhd';

        const timeEntryInfo = {
            jobType: 'Other',
            jobDescription: 'fake job',
            costCode: '22-222',
            timeWorked: 3,
            jobDate: now,
            latitudeCreated: null,
            latitudeUpdated: null,
            longitudeCreated: null,
            longitudeUpdated: null
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}`,
            payload: timeEntryInfo
        };

        const res = await Server.server.inject(injectOptions);

        addEntryStub.parent.restore();

        Sinon.assert.calledOnce(addEntryStub);
        Code.expect(res.statusCode).to.equal(201);
    });

    lab.test('should successfully update an existing entry if payload is validated', async () => {

        const updateEntryStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        collection() {

                            return {
                                doc() {

                                    return {
                                        update: Sinon.stub()
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        const now = new Date();
        const fakeUserId = 'ijhgy783i4rfivuhd';
        const fakeEntryId = 's8cxutv7e8riuktht';

        const timeEntryInfo = {
            jobType: 'Other',
            jobDescription: 'fake job',
            costCode: '22-222',
            timeWorked: 3,
            jobDate: now,
            latitudeCreated: null,
            latitudeUpdated: null,
            longitudeCreated: null,
            longitudeUpdated: null
        };

        const injectOptions = {
            method: 'POST',
            url: `/entry/${fakeUserId}/${fakeEntryId}`,
            payload: timeEntryInfo
        };

        const res = await Server.server.inject(injectOptions);

        updateEntryStub.parent.restore();

        Sinon.assert.calledOnce(updateEntryStub);
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

        const fakeUserId = '93nmflkajsdf';

        const injectOptions = {
            method: 'GET',
            url: `/entries/${fakeUserId}`
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

        const fakeUserId = '93nmflkajsdf';

        const injectOptions = {
            method: 'GET',
            url: `/entries/${fakeUserId}`
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

        const fakeEntryId = 'ijdhuejwrt98u';
        const fakeUserId = 'wjneroi3j45fve';

        const injectOptions = {
            method: 'DELETE',
            url: `/entry/${fakeEntryId}/${fakeUserId}`
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

        const fakeEntryId = 'ijdhuejwrt98u';
        const fakeUserId = 'wjneroi3j45fve';

        const injectOptions = {
            method: 'DELETE',
            url: `/entry/${fakeEntryId}/${fakeUserId}`
        };

        const res = await Server.server.inject(injectOptions);

        deleteStub.parent.restore();

        Sinon.assert.calledOnce(deleteStub);
        Code.expect(res.statusCode).to.equal(200);
    });
});
