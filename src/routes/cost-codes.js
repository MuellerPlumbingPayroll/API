import functions from '../handlers/cost-code.js';
import costCodeSchema from '../models/costcode.js';

const costCodes = [{
    method: 'POST',
    path: '/cost-code',
    handler: functions.addCostCode,
    options:{
        tags: [
            'api',
            'auth'
        ],
        validate: {
            payload: costCodeSchema
        }
    }

},
{
    method: 'GET',
    path: '/cost-code',
    handler: functions.getCostCodes,
    options: {
        tags: [
            'api'
        ]
    }
},
{
    method: 'DELETE',
    path: '/cost-code/{id}',
    handler: functions.removeCostCode,
    options: {
        tags: [
            'api'
        ]
    }
}
];

export default costCodes;
