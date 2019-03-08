const Joi = require('joi');

const codeMaxLength = 8;
const maxNumberHours = 16;
const JobType = ['Construction', 'Service', 'Other'];

const EntrySchema = Joi.object().keys({
    jobType: Joi.string().valid(JobType).required(),
    jobDescription: Joi.string().required(),
    costCode: Joi.string().regex(/^\d+-\d+$/).max(codeMaxLength).default(null), // May not care about some cost-codes e.g. holiday
    jobDate: Joi.date().required(),
    timeWorked: Joi.number().min(0).max(maxNumberHours).required(),
    // Location
    latitudeCreated: Joi.number().min(-90).max(90).allow(null).required(),
    latitudeUpdated: Joi.number().min(-90).max(90).allow(null).required(),
    longitudeCreated: Joi.number().min(-180).max(180).allow(null).required(),
    longitudeUpdated: Joi.number().min(-180).max(180).allow(null).required()
});

export default EntrySchema;
