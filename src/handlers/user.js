import Boomify from 'boom';

const functions = Object.create({});

functions.addUser = async (request, h) => {

    const payLoad = request.payload;

    const server = require('../server.js');

    // Add new user to users colection
    try {
        const userDoc = await server.db.collection('users').add({
            email: payLoad.email,
            googleToken: payLoad.googleToken,
            isActive: payLoad.isActive,
            dateToRemove: payLoad.dateToRemove
        });

        return h.response(userDoc).code(201); // return created status code
    }
    catch (err) {
        console.log(err);
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
// Completely deleting a user will require retrieve all entries for a user and deleting them manually
functions.removeUser = async (request, h) => {

    const server = require('../server.js');

    const id = request.params.id;

    try {
        // delete the user's entries first
        await server.db.collection('users').doc(id).delete();

        return h.response();
    }
    catch (err) {
        return new Boomify(err);
    }
};

// const deleteUserEntries = function (userId) {

//     const server = require('../server.js');

//     const snapshot = server.db.collection('users').doc(userId).collection('entries').get();
//     const entryIds = snapshot.docs.map((doc) => doc.id );
//     console.log('ids to delete: ', entryIds);

// };

export default functions;
