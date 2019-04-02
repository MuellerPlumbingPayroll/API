import jobs from './jobs';
import costCodes from './cost-codes';
import entries from './entries';
import users from './users';
import auth from './authentications';
import timecards from './timecards';

let routes = [];

routes = routes.concat(jobs);
routes = routes.concat(costCodes);
routes = routes.concat(entries);
routes = routes.concat(users);
routes = routes.concat(auth);
routes = routes.concat(timecards);

export default routes;
