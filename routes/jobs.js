
import { functions } from '../handlers/job';
const jobs = [{
    method: 'GET',
    path: '/',
    handler: functions.get
}
];
export default jobs;
