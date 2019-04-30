import functions from '../handlers/cron-job';

const cronJobs = [{
    method: 'GET',
    path: '/remove/inactiveUsers',
    handler: functions.removeInactiveUsers,
    options: {
        auth:false,
        tags: [
            'api'
        ]
    }
},
{
    method: 'GET',
    path: '/remove/oldEntries',
    handler: functions.removeOldEntries,
    options: {
        auth:false,
        tags: [

            'api'
        ]
    }
}
];

export default cronJobs;
