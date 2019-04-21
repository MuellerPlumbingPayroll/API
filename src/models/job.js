const Joi = require('joi');

const jobSchema = Joi.object().keys({
    id: Joi.string().allow(null).required(),
    jobNumber: Joi.string().required(),
    clientName: Joi.string().required(),
    address: Joi.string().min(5).max(140).required(),
    isActive: Joi.boolean().required()
});

export default jobSchema;
