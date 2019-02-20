import functions from '../handlers/cost-code.js';

const costCodes = [{
    method: 'POST',
    path: '/cost-code',
    handler: functions.addCostCode,
    options:{
        tags: [
            'api'
        ]
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
