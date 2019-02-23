const Joi = require('joi');

const JobType = ['construction', 'service', 'other'];

const EntrySchema = Joi.object().keys({
    id: Joi.string().required(),
    userId: Joi.number().required(),

    jobType: Joi.string().valid(JobType).required(),
    jobDescription: Joi.string().required(),
    costCode: Joi.number(), // May not care about some cost-codes e.g. holiday

    timeWorked: Joi.number().required(),
    timeCreated: Joi.date().required(),
    timeUpdated: Joi.date().required(),

    // Location 
    latitudeCreated: Joi.number().min(-90).max(90).default(null),
    latitudeUpdated: Joi.number().min(-90).max(90).default(null),
    longitudeCreated: Joi.number().min(-180).max(180).default(null),
    longitudeUpdated: Joi.number().min(-180).max(180).default(null)
});

export default EntrySchema;