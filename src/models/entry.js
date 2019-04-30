import jobSchema from '../models/job.js';
import costCodeSchema from '../models/costcode.js';

const Joi = require('joi');

const maxNumberHours = 16;
const JobType = ['Construction', 'Service', 'Other'];

const EntrySchema = Joi.object().keys({
    jobType: Joi.string().valid(JobType).required(),
    job: Joi.alternatives()
        .when('jobType', { is: 'Construction', then: jobSchema })
        .when('jobType', { is: 'Service', then: Joi.string() })
        .when('jobType', { is: 'Other', then: jobSchema }),
    costCode: costCodeSchema.allow(null),
    jobDate: Joi.date().required(),
    timeWorked: Joi.number().min(0).max(maxNumberHours).required(),
    latitude: Joi.number().min(-90).max(90).allow(null).required(),
    longitude: Joi.number().min(-180).max(180).allow(null).required()
});

export default EntrySchema;
