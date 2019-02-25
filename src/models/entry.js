const Joi = require('joi');

const maxNumberHours = 16;
const JobType = ['Construction', 'Service', 'Other'];

const EntrySchema = Joi.object().keys({
    id: Joi.string().required(),
    userId: Joi.string().required(),

    jobType: Joi.string().valid(JobType).required(),
    jobDescription: Joi.string().required(),
    costCode: Joi.string().default(null), // May not care about some cost-codes e.g. holiday

    timeWorked: Joi.number().min(0).max(maxNumberHours).required(),
    timeCreated: Joi.date().required(),
    timeUpdated: Joi.date().required(),

    // Location
    latitudeCreated: Joi.number().min(-90).max(90).default(null),
    latitudeUpdated: Joi.number().min(-90).max(90).default(null),
    longitudeCreated: Joi.number().min(-180).max(180).default(null),
    longitudeUpdated: Joi.number().min(-180).max(180).default(null)
});

export default EntrySchema;
