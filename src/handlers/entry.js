import Boomify from 'boom';

const functions = Object.create({});

functions.addEntry = async (request, h) => {

    const entryInfo = request.payload;

    const userId = request.params.userId;
    const entryId = request.params.entryId;
    const now = new Date();

    const server = require('../server.js');

    try {
        // Add new entry
        if (entryId === undefined) {

            entryInfo.timeCreated = now;
            entryInfo.timeUpdated = now;

            const newEntryRef = await server.db.collection('users').doc(userId).collection('entries').add(entryInfo);
            return h.response(newEntryRef.id).code(201);
        }

        // Update existing entry
        const entryRef = await server.db.collection('users').doc(userId).collection('entries').doc(entryId);
        // Don't update location
        delete entryInfo.latitude;
        delete entryInfo.longitude;

        entryInfo.timeUpdated = now;
        entryRef.update(entryInfo);

        return h.response(entryInfo).code(201);
    }
    catch (err) {
        return new Boomify(err);
    }
};

// Gets all entries for a single user
functions.getUserEntries = async (request, h) => {

    const server = require('../server.js');

    const userId = request.params.userId;

    try {
        const entryRefs = await server.db.collection('users').doc(userId).collection('entries').get();
        if (entryRefs.empty) {
            return [];
        }

        return entryRefs.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
    }
    catch (error) {
        return new Boomify(error);
    }
};

// Remove a single entry for a given user
functions.removeEntry = async (request, h) => {

    const server = require('../server.js');

    const entryId = request.params.id;
    const userId = request.params.userId;

    try {
        await server.db.collection('users').doc(userId).collection('entries').doc(entryId).delete();

        return h.response(); // Will return OK
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
