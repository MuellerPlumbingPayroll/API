
const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const Joi = require('joi');

const lab = exports.lab = Lab.script();


lab.experiment('When adding an entry', () => {

    // Sinon.beforeEach( () => {

    //     const injectOptions = {
    //         method: 'POST',
    //         url: '/entry/fakeUser'
    //     };
    // });

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
            url: '/entry/fakeUser',
            payload: missingAttrsPayLoad
        };

        const res = await Server.server.inject(injectOptions);

        Code.expect(res.statusCode).to.equal(400); // Expect Bad Request HTTP response
    });

    lab.test('should return 400 status code if userId is not a string', async () => {

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
            url: '/entry/fakeUser',
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
            url: '/entry/fakeUser',
            payload: timeEntry
        };

        const res = await Server.server.inject(injectOptions);

        firebaseStub.parent.restore();

        Sinon.assert.calledOnce(firebaseStub);
        Code.expect(res.statusCode).to.equal(201);
    });
});
