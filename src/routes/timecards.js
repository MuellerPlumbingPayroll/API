import functions from '../handlers/timecard.js';
import timecardSchema from '../models/timecard.js';

const timecards = [{
    method: 'POST',
    path: '/submit/{userId}',
    handler: functions.submit,
    options:{
        tags: [
            'api'
        ],
        validate: {
            payload: timecardSchema
        }
    }
}
];

export default timecards;
