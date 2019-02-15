import jobs from './jobs';
import costCodes from './cost-codes';

let routes = [];

routes = routes.concat(jobs);
routes = routes.concat(costCodes);

export default routes;
