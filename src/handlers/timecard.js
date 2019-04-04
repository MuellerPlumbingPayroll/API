import Boomify from 'boom';
import { lastPayPeriod } from '../utils/payperiod';

const functions = Object.create({});

functions.submit = async (request, h) => {

    const timecardToSubmit = request.payload;
    const userId = request.params.userId;
    const prevPayPeriod = await lastPayPeriod();

    const server = require('../server.js');

    try {
        const userTimecardsRef = await server.db.collection('timecards').where('userId', '==', userId).get();
        const timecards = userTimecardsRef.docs.map((doc) => Object.assign(doc.data()));

        // Check if user has already submitted timecard for previous pay period
        for (let i = 0; i < timecards.length; ++i) {
            // Firebase stores Date objects as Timestamps
            const startDate = timecards[i].startDate.toDate();

            if (startDate.getDate() === prevPayPeriod.startDate.getDate() &&
                startDate.getMonth() === prevPayPeriod.startDate.getMonth() &&
                startDate.getFullYear() === prevPayPeriod.startDate.getFullYear()) {

                // Ignore request
                return h.response();
            }
        }

        // Submit timecard
        timecardToSubmit.userId = userId;
        timecardToSubmit.startDate = prevPayPeriod.startDate;
        timecardToSubmit.endDate = prevPayPeriod.endDate;
        await server.db.collection('timecards').add(timecardToSubmit);

        return h.response(timecardToSubmit).code(201);
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
