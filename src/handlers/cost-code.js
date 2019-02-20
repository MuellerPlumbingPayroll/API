import Boomify from 'boom';
import CostCode from '../models/costcode.js';

const Joi = require('joi');

const schema = Joi.object().keys({
    code: Joi.number().integer().required(),
    description: Joi.string().min(5).max(140).required()
});

const functions = Object.create({});

functions.addCostCode = async (request, h) => {

    // Validate payload against required schema for a cost-code
    const validate = Joi.validate(request.payload, schema);

    if ( !(validate.error === null) ) {
        return Boomify.badRequest('Payload does not match the required schema for a cost-code.');
    }

    const payLoad = request.payload;
    const costCode = new CostCode(payLoad.code, payLoad.code, payLoad.description);

    const server = require('../server.js');

    // Create new cost-code document. If cost-code already exists then update.
    try {
        await server.db.collection('cost-codes').doc(String(costCode.code)).set({
            code: costCode.code,
            description: costCode.description
        });

        return h.response(costCode).code(201); // return created status code
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
            return {};
        }

        return snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()));
    }
    catch (err) {
        return new Boomify(err);
    }
};

export default functions;
