// Makes a request to firebase for a user document with the provided userId.
// Note: if a server error occurs then function returns false. Depending on
// how userExists is handled http error could be misleading.
export const userExists = async (userId) => {

    const server = require('../server.js');

    try {

        const userRef = await server.db.collection('users').doc(userId).get();
        if (userRef.exists) {
            return true;
        }

        return false;
    }
    catch (err) {
        return false;
    }
};
