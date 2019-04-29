import Boomify from 'boom';
import { getInactiveUserIds, removeUserEntries, removeUser, getUserIds, removeEntriesOnOrBefore } from '../utils/cron-job';

const functions = Object.create({});

// Cron job will be executed every 6 months
// Or monthly...
functions.removeInactiveUsers = async (request, h) => {

    try {
        const inactiveUserIds = await getInactiveUserIds();

        for (let i = 0; i < inactiveUserIds.length; ++i) {
            const id = inactiveUserIds[i];
            await removeUserEntries(id);
            await removeUser(id);
        }

        return h.response();
    }
    catch (error) {
        return new Boomify(error);
    }
};

// Cron job will be executed once a year
// January 1st
functions.removeOldEntries = async (request, h) => {

    const year = new Date().getFullYear() - 2;
    const endOfYear = new Date(year, 12, 31, 23, 59, 59);

    try {
        const userIds = await getUserIds();

        for (let i = 0; i < userIds.length; ++i) {
            const id = userIds[i];
            await removeEntriesOnOrBefore(id, endOfYear);
        }

        return h.response();
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
