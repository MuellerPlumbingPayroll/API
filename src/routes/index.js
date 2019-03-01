import jobs from './jobs';
import costCodes from './cost-codes';
import users from './users';

let routes = [];

routes = routes.concat(jobs);
routes = routes.concat(costCodes);
routes = routes.concat(users);

export default routes;
