import jobs from './jobs';
import costCodes from './cost-codes';
import entries from './entries';

let routes = [];

routes = routes.concat(jobs);
routes = routes.concat(costCodes);
routes = routes.concat(entries);

export default routes;
