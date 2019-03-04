

const Hapi        = require('hapi');
const Inert       = require('inert');
const Vision      = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack        = require('../package.json');
const Admin = require('firebase-admin');

import routes from './routes/index';

require('babel-core').transform('code');

// Initialize Firebase
const config = {

    projectId: 'muller-plumbing-salary'
};
Admin.initializeApp(config);

const db = Admin.firestore();
db.settings({ timestampsInSnapshots: true });

const server = new Hapi.Server({
    //host: 'localhost',
    host: '0.0.0.0', //For Deploy
    port: process.env.PORT,
    routes:{
        cors: true
    }
});

(async () => {


    const HapiSwaggerConfig = {
        plugin: HapiSwagger,
        options: {
            info: {
                title: Pack.name,
                description: Pack.description,
                version: Pack.version
            },
            swaggerUI: true,
            basePath: '/',
            pathPrefixSize: 2,
            jsonPath: '/docs/swagger.json',
            sortPaths: 'path-method',
            lang: 'en',
            tags: [
                { name: 'api' }
            ],
            documentationPath: '/',
            securityDefinitions: {}
        }
    };

    /* register plugins */
    await server.register([
        Inert,
        Vision,
        HapiSwaggerConfig
    ]);

    // console.log(routes);

    // require routes
    await server.route(routes);
    await server.start();

    console.log('Server running at:', server.info.uri);
})();

module.exports = {
    server,
    db
};
