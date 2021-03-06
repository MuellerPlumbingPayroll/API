import Boomify from 'boom';

const functions = Object.create({});

functions.addCostCode = async (request, h) => {

    const payLoad = request.payload;

    const server = require('../server.js');

    // Create new cost-code document. If cost-code already exists then update.
    try {
        await server.db.collection('cost-codes').doc(payLoad.code).set({
            code: payLoad.code,
            codeGroup: payLoad.codeGroup,
            description: payLoad.description
        });

        return h.response(payLoad).code(201); // return created status code
    }
    catch (err) {
        return new Boomify(err);
    }
};

functions.getCostCodes = async (request, h) => {

    const server = require('../server.js');

    try {
        const snapshot = await server.db.collection('cost-codes').get(); // All documents in cost-codes collection
        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
    }
    catch (err) {
        return new Boomify(err);
    }
};

functions.removeCostCode = async (request, h) => {

    const server = require('../server.js');

    const id = request.params.id;
    try {
        await server.db.collection('cost-codes').doc(id).delete();

        return h.response();
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
