import Boomify from 'boom';

const functions = Object.create({});

functions.addUser = async (request, h) => {

    const userInfo = request.payload;
    const userId = request.params.id;

    const server = require('../server.js');

    try {
        // Add new user to users collection
        if (userId === undefined) {

            await server.db.collection('users').add({
                email: userInfo.email,
                isActive: userInfo.isActive,
                dateToRemove: userInfo.dateToRemove
            });
        }
        // Update existing user
        else {

            const userRef = await server.db.collection('users').doc(userId);
            userRef.update(userInfo);
        }

        return h.response().code(201); // return created status code
    }
    catch (err) {
        return new Boomify(err);
    }
};

functions.getUsers = async (request, h) => {

    const server = require('../server.js');

    try {
        const userRefs = await server.db.collection('users').get();
        if (userRefs.empty) {
            return {};
        }

        return userRefs.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
    }
    catch (err) {
        return new Boomify(err);
    }
};

// When deleting a user, the user's entries subcollection will not be deleted automatically
// Firebase does not have functionality to delete an entire collection.
// Completely deleting a user requires retrieving all entries for a user and deleting the entries manually.
// Once all entries have been deleted the user can be deleted.
functions.removeUser = async (request, h) => {

    const server = require('../server.js');

    const id = request.params.id; // user id

    try {
        // get all entries for user
        const entriesSnapshot = await server.db.collection('users').doc(id).collection('entries').get();
        const entryIds = entriesSnapshot.docs.map((doc) => doc.id);

        // delete user's entries
        await entryIds.forEach((entryId) => {

            server.db.collection('users').doc(id).collection('entries').doc(entryId).delete();
        });

        // delete the user
        await server.db.collection('users').doc(id).delete();

        return h.response();
    }
    catch (err) {
        return new Boomify(err);
    }
};

export default functions;
