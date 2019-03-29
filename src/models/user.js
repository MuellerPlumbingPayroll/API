const Joi = require('joi');

const nameMaxLength = 30;
const nameMinLength = 3;

const userSchema = Joi.object().keys({
    email: Joi.string().regex(/^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/i).required(),
    firstName: Joi.string().min(nameMinLength).max(nameMaxLength).required(),
    lastName: Joi.string().min(nameMinLength).max(nameMaxLength).required(),
    isActive: Joi.boolean().required(),
    dateToRemove: Joi.date().allow(null).default(null)
});

export default userSchema;
