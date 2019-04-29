import Boomify from 'boom';
import { getInactiveUserIds, removeUserEntries, removeUser } from '../utils/cron-job';

const functions = Object.create({});

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

export default functions;
