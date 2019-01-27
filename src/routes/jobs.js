
import  functions  from '../handlers/job';

const jobs = [{
    method: 'GET',
    path: '/test',
    handler: functions.get,
    options:{
        tags: [
            'api'
        ]
    }

}
];
export default jobs;
