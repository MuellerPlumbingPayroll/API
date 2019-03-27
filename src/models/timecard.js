const Joi = require('joi');

const timecardSchema = Joi.object().keys({
    injured: Joi.boolean().required()
});

export default timecardSchema;
