import functions from '../handlers/cost-code.js';
import costCodeSchema from '../models/costcode.js';

const costCodes = [{
    method: 'POST',
    path: '/cost-code',
    handler: functions.addCostCode,
    options:{
        tags: [
            'api'
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
}
];

export default costCodes;
