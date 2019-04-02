// Makes a request to firestore for a user document with the provided userId.
// If database request completes without failure then user exists, otherwise
// the provided userId does not belong to an existing user. Its important to
// note that the occurrence of an error is not necessarily because doc with
// id = userId does not exist. It's possible the error occured with the server or database.
export const userExists = async (userId) => {

    const server = require('../server.js');

    try {
        await server.db.collection('users').doc(userId);
        return true;
    }
    catch (err) {
        return false;
    }
};
