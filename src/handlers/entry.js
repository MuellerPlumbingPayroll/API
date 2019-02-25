import Boomify from 'boom';

const functions = Object.create({});

functions.addEntry = async (request, h) => {

    const payLoad = request.payload;

    const id = payLoad.id;
    const userId = request.params.userId;
    const jobType = payLoad.jobType;
    const jobDescription = payLoad.jobDescription;
    const costCode = payLoad.costCode;
    const timeWorked = payLoad.timeWorked;
    const timeCreated = payLoad.timeCreated;
    const timeUpdated = payLoad.timeUpdated;
    const latitudeCreated = payLoad.latitudeCreated;
    const latitudeUpdated = payLoad.latitudeUpdated;
    const longitudeCreated = payLoad.longitudeCreated;
    const longitudeUpdated = payLoad.longitudeCreated;

    const server = require('../server.js');

    try {
        // Add a new entry doccument to a users entry collection
        await server.db.collection('users').doc(userId).collection('entries').doc(id).set({
            id,
            userId,
            jobType,
            jobDescription,
            costCode,
            timeWorked,
            timeCreated,
            timeUpdated,
            latitudeCreated,
            latitudeUpdated,
            longitudeCreated,
            longitudeUpdated
        });

        return h.response(payLoad).code(201);
    }
    catch (err) {
        console.log(err);
        return new Boomify(err);
    }
};

export default functions;
