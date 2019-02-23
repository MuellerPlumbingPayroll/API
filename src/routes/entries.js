import functions from '../handlers/entry.js';
import EntrySchema from '../models/entry.js';

const entries = [{
    method: 'POST',
    path: '/entry/{userId}',
    handler: functions.addEntry,
    options:{
        tags: [
            'api'
        ],
        validate: {
            payload: EntrySchema
        }
    }
}
];

export default entries;
