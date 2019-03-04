import functions from '../handlers/user.js';
import userSchema from '../models/user.js';

const users = [{
    method: 'POST',
    path: '/users',
    handler: functions.addUser,
    options:{
        tags: [
            'api'
        ],
        validate: {
            payload: userSchema
        }
    }

},
{
    method: 'GET',
    path: '/users',
    handler: functions.getUsers,
    options: {
        tags: [
            'api'
        ]
    }
},
{
    method: 'DELETE',
    path: '/users/{id}',
    handler: functions.removeUser,
    options: {
        tags: [
            'api'
        ]
    }
}
];

export default users;
