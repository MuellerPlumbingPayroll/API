import jobs from './jobs';
import costCodes from './cost-codes';
import entries from './entries';
import users from './users';
import auth from './authentications';
import timecards from './timecards';
import cronJobs from './cron-jobs';

let routes = [];

routes = routes.concat(jobs);
routes = routes.concat(costCodes);
routes = routes.concat(entries);
routes = routes.concat(users);
routes = routes.concat(auth);
routes = routes.concat(timecards);
routes = routes.concat(cronJobs);

export default routes;
