const Joi = require('joi');

const codeMaxLength = 8; // Most cost-codes are len 6, so 8 gives some flexibility
const descriptionMinLength = 5;
const descriptionMaxLength = 140;

const costCodeSchema = Joi.object().keys({
    code: Joi.string().required().max(codeMaxLength),
    codeGroup: Joi.string().required(),
    description: Joi.string().min(descriptionMinLength).max(descriptionMaxLength).required()
});

export default costCodeSchema;
