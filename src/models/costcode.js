const Joi = require('joi');

const costCodeSchema = Joi.object().keys({
    code: Joi.string().required(),
    codeGroup: Joi.string().required(),
    description: Joi.string().min(5).max(140).required()
});

export default costCodeSchema;
