const Joi = require('joi');

const timecardSchema = Joi.object().keys({
    userId: Joi.string().required(),
    injured: Joi.boolean().required()
});

export default timecardSchema;
