// Makes a request to firebase for a user document with the provided userId.
export const userExists = async (userId) => {

    const server = require('../server.js');

    try {

        const userRef = await server.db.collection('users').doc(userId).get();

        if (userRef.exists) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
    catch (err) {
        return Promise.reject(err);
    }
};
