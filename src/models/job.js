const Joi = require('joi');

const maxJobNumLength = 9;
const jobSchema = Joi.object().keys({
    id: Joi.string().allow(null).required(),
    jobNumber: Joi.string().regex(/^\d+-\d+$/).max(maxJobNumLength).required(),
    clientName: Joi.string().required(),
    address: Joi.string().min(5).max(140).required(),
    isActive: Joi.boolean().required()
});

export default jobSchema;
