/* eslint-disable no-console */

const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');

const lab = exports.lab = Lab.script();

// let's get a server instance

lab.experiment('inject requests with server.inject', () => {

    lab.test('injects a request to a hapi server without a route', async () => {

        const res = await Server.inject('/test');
        Code.expect(res.statusCode).to.equal(200);
    });
});
