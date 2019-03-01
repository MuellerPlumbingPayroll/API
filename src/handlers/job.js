import Boomify from 'boom';

const functions = Object.create({});

functions.addJobs = async (request, h) => {

    const jobs = request.payload; // Array of job objects
    const server = require('../server.js');

    try {
        await jobs.forEach((job) => {

            if (job.id === null) { // new job
                server.db.collection('jobs').add(job); // initially id field in database is null
            }
            else { // existing job
                const jobRef = server.db.collection('jobs').doc(job.id);
                jobRef.update(job);
            }
        });

        return h.response();
    }
    catch (error) {
        console.log(error);
        return new Boomify(error);
    }

};

functions.getJobs = async (request, h) => {

    const server = require('../server.js');

    try {
        const snapshot = await server.db.collection('jobs').get();
        if (snapshot.empty) {
            return {};
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));

    }
    catch (error) {
        return new Boomify(error);
    }
};

functions.removeJob = async (request, h) => {

    const server = require('../server.js');

    const id = request.params.id;

    try {
        await server.db.collection('jobs').doc(id).delete();

        return h.response();
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
