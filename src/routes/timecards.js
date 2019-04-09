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
},
{
    method: 'GET',
    path: '/timecards/{userIds}/{startDate}/{endDate}',
    handler: functions.getTimecards,
    options: {
        tags: [
            'api'
        ]
    }
}
];

export default timecards;
