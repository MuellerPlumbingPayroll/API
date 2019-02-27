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

export default functions;
