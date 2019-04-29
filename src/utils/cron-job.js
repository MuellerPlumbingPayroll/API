export const getInactiveUserIds = async () => {

    const server = require('../server.js');

    const now = new Date();
    try {
        const query = await server.db.collection('users')
            .where('isActive', '==', false)
            .where('dateToRemove', '<=', now);

        const snapshot = await query.get();
        if (snapshot.empty) {
            return [];
        }

        const ids = snapshot.docs.map((doc) => doc.id);
        return ids;
    }
    catch (err) {
        throw err;
    }
};

export const removeUserEntries = async (id) => {

    const server = require('../server.js');

    try {
        // get all entries for user
        const entriesSnapshot = await server.db.collection('users').doc(id).collection('entries').get();
        const entryIds = entriesSnapshot.docs.map((doc) => doc.id);

        // delete user's entries one at a time
        await entryIds.forEach((entryId) => {

            server.db.collection('users').doc(id).collection('entries').doc(entryId).delete();
        });
    }
    catch (err) {
        throw err;
    }
};

export const removeUser = async (id) => {

    const server = require('../server.js');

    try {
        // delete the user
        await server.db.collection('users').doc(id).delete();
    }
    catch (err) {
        throw err;
    }
};

export const getUserIds = async () => {

    const server = require('../server.js');

    try {
        const snapshot = await server.db.collection('users').get();
        if (snapshot.empty) {
            return [];
        }

        const ids = snapshot.docs.map((doc) => doc.id);
        return ids;
    }
    catch (err) {
        throw err;
    }
};

export const removeEntriesOnOrBefore = async (id, date) => {

    const server = require('../server.js');

    try {
        const query = await server.db.collection('users').doc(id).collection('entries')
            .where('jobDate', '<=', date);

        const snapshot = query.get();
        if (snapshot.empty) {
            return;
        }

        const entryIds = snapshot.docs.map((doc) => doc.id);
        await entryIds.forEach((entryId) => {

            server.db.collection('users').doc(id).collection('entries').doc(entryId).delete();
        });
    }
    catch (err) {
        throw err;
    }
};
