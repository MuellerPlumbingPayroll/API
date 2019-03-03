import Boomify from 'boom';

const functions = Object.create({});

functions.addEntry = async (request, h) => {

    const payLoad = request.payload;

    const entryId = payLoad.id;
    const userId = payLoad.userId;

    const server = require('../server.js');

    try {
        // Add a new entry doccument to a users entry collection
        await server.db.collection('users').doc(userId).collection('entries').doc(entryId).set({
            userId: payLoad.userId,
            jobType: payLoad.jobType,
            jobDescription: payLoad.jobDescription,
            costCode: payLoad.costCode,
            timeWorked: payLoad.timeWorked,
            timeCreated: payLoad.timeCreated,
            timeUpdated: payLoad.timeUpdated,
            latitudeCreated: payLoad.latitudeCreated,
            latitudeUpdated: payLoad.latitudeUpdated,
            longitudeCreated: payLoad.longitudeCreated,
            longitudeUpdated: payLoad.longitudeUpdated
        });

        return h.response(payLoad).code(201);
    }
    catch (err) {
        console.log(err);
        return new Boomify(err);
    }
};

// Gets all entries for a single user
functions.getUserEntries = async (request, h) => {

    const server = require('../server.js');

    const userId = request.params.userId;

    try {
        const snapshot = await server.db.collection('users').doc(userId).collection('entries').get();
        if (snapshot.empty) {
            return {};
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
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
