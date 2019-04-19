import functions from '../handlers/authentication.js';

const Joi = require('joi');

const auth = [{
    method: 'GET',
    path: '/authenticate/{email}',
    handler: functions.authenticateEmail,
    options: {
        auth:false,
        tags: [
            'api'
        ],
        validate: {
            params: {
                email: Joi.string().regex(/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/i)
            }
        }
    }
},
{
    method: 'GET',
    path: '/authenticate/admin/{email}',
    handler: functions.authenticateAdminEmail,
    options: {
        auth:false,
        tags: [
            'api'
        ],
        validate: {
            params: {
                email: Joi.string().regex(/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/i)
            }
        }
    }
}
];

export default auth;
