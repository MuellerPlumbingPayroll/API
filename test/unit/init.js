/* eslint-disable no-console */

const Code = require('code');
const Lab = require('lab');
const Server = require('../../src/server');

const lab = exports.lab = Lab.script();

// let's get a server instance

lab.experiment('inject requests with server.inject', () => {

    lab.test('injects a request to a hapi server without a route', async () => {

        const res = await Server.server.inject('/test');
        Code.expect(res.statusCode).to.equal(200);
    });

    lab.test('get cost codes', async () => {

        const res = await Server.server.inject('/cost-code/');
        Code.expect(res.statusCode).to.equal(200);
    });
});
