import Boomify from 'Boom';

const functions = Object.create({});

functions.addCostCode = async (request, h) => {

    const code = request.payload.code;
    const description = request.payload.description;

    const server = require('../server.js');

    // Create new cost code document. If code already exists then update.
    try {
        await server.db.collection('cost-codes').doc(String(code)).set({
            code,
            description
        });

        return 'Successfully added cost code'; // return 200
    }
    catch (err) {
        return new Boomify(err);
    }
};

functions.getCostCodes = async (request, h) => {

    const server = require('../server.js');

    try {
        const snapshot = await server.db.collection('cost-codes').get();
        if (snapshot.empty) {
            return {};
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
    }
    catch (err) {
        return new Boomify(err);
    }
};

export default functions;
