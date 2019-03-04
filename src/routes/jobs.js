import  functions  from '../handlers/job';
import jobSchema from '../models/job.js';

const Joi = require('joi');

const jobs = [{
    method: 'POST',
    path: '/jobs',
    handler: functions.addJobs,
    options:{
        tags: [
            'api'
        ],
        validate: {
            payload: Joi.array().items(jobSchema).required()
        }
    }

},
{
    method: 'GET',
    path: '/jobs',
    handler: functions.getJobs,
    options:{
        tags: [
            'api'
        ]
    }
},
{
    method: 'DELETE',
    path: '/jobs/{id}',
    handler: functions.removeJob,
    options:{
        tags: [
            'api'
        ]
    }
}
];
export default jobs;
