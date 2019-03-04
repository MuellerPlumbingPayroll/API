
const Joi = require('joi');

const userSchema = Joi.object().keys({
    email: Joi.string().regex(/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/i).required(),
    isActive: Joi.boolean().required(),
    dateToRemove: Joi.date().default(null)
});

export default userSchema;
