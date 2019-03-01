
const Joi = require('joi');

const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    googleToken: Joi.string().allow(null).default(null),
    isActive: Joi.boolean().required(),
    dateToRemove: Joi.date().default(null)
});

export default userSchema;
