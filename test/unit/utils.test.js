const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');
const Sinon = require('sinon');
const UtilsDB = require('../../src/utils/database');

const lab = exports.lab = Lab.script();

lab.experiment('When checking if a user exists', () => {

    lab.test('should return true if user is found', async () => {

        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns({ exists: true })
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';
        const res = await UtilsDB.userExists(fakeId);

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
        Code.expect(res).to.equal(true);
    });

    lab.test('should return false if a user is not found', async () => {

        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns({ exists: false })
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';
        const res = await UtilsDB.userExists(fakeId);

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
        Code.expect(res).to.equal(false);
    });

    lab.test('should return false if error occurs when getting user', async () => {

        const userRefStub = Sinon.stub(Server.db, 'collection').withArgs('users').callsFake(() => {

            return {
                doc() {

                    return {
                        get: Sinon.stub().returns(Promise.reject())
                    };
                }
            };
        });

        const fakeId = '03oiejhufirekmnrjkl3';
        const res = await UtilsDB.userExists(fakeId);

        userRefStub.parent.restore();

        Sinon.assert.calledOnce(userRefStub);
        Code.expect(res).to.equal(false);
    });
});
