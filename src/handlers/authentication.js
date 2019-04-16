import Boomify from 'boom';
import Boom from 'boom';

const functions = Object.create({});

functions.authenticateEmail = async (request, h) => {

    const server = require('../server.js');

    const emailToAuthenticate = request.params.email;

    try {
        // Get all users from Firebase
        const userRefs = await server.db.collection('users').get();

        // Keep id and user data
        const users = userRefs.docs.map((user) => Object.assign({ id: user.id }, user.data()));

        let authorizedUserId = null;

        // Check if any user emails match given email
        for (let i = 0; i < users.length; ++i) {
            if (users[i].email === emailToAuthenticate) {
                if (users[i].isActive === true) {
                    authorizedUserId = users[i].id;
                }

                break;
            }
        }

        if (authorizedUserId === null) {
            return Boom.unauthorized('You are not authorized to access. Check with your administrator.');
        }

        return h.response(authorizedUserId);
    }
    catch (error) {
        return new Boomify(error);
    }
};

functions.authenticateAdminEmail = async (request, h) => {

    const server = require('../server.js');

    const emailToAuthenticate = request.params.email;

    try {
        // Get all users from Firebase
        const userRefs = await server.db.collection('users').get();

        // Keep id and user data
        const users = userRefs.docs.map((user) => Object.assign({ id: user.id }, user.data()));

        let authorizedUserId = null;

        // Check if any user emails match given email
        for (let i = 0; i < users.length; ++i) {
            if (users[i].email === emailToAuthenticate) {
                if (users[i].isActive === true && users[i].isAdmin === true) {
                    authorizedUserId = users[i].id;
                }

                break;
            }
        }

        if (authorizedUserId === null) {
            return Boom.unauthorized('You are not authorized to access. Check with your administrator.');
        }

        return h.response(authorizedUserId);
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
