import functions from '../handlers/cron-job';

const cronJobs = [{
    method: 'GET',
    path: '/remove/inactiveUsers',
    handler: functions.removeInactiveUsers,
    options: {
        tags: [
            'api'
        ]
    }
}
];

export default cronJobs;