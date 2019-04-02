import functions from '../handlers/entry.js';
import EntrySchema from '../models/entry.js';

const entries = [{
    method: 'POST',
    path: '/entry/{userId}/{entryId?}',
    handler: functions.addEntry,
    options:{
        tags: [
            'api'
        ],
        validate: {
            payload: EntrySchema
        }
    }
},
{
    method: 'GET',
    path: '/entries/{userId}',
    handler: functions.getUserEntries,
    options: {
        tags: [
            'api'
        ]
    }
},
{
    method: 'DELETE',
    path: '/entry/{userId}/{entryId}',
    handler: functions.removeEntry,
    options: {
        tags: [
            'api'
        ]
    }
}
];

export default entries;
