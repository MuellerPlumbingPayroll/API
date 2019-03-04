import Boomify from 'boom';

const functions = Object.create({});

functions.addUser = async (request, h) => {

    const payLoad = request.payload;

    const server = require('../server.js');

    // Add new user to users colection
    try {
        await server.db.collection('users').add({
            email: payLoad.email,
            isActive: payLoad.isActive,
            dateToRemove: payLoad.dateToRemove
        });

        return h.response().code(201); // return created status code
    }
    catch (err) {
        return new Boomify(err);
    }
};

functions.getUsers = async (request, h) => {

    const server = require('../server.js');

    try {
        const snapshot = await server.db.collection('users').get();
        if (snapshot.empty) {
            return {};
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
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
