import Boomify from 'boom';
import Boom from 'boom';
import { lastPayPeriod, currentPayPeriod } from '../utils/payperiod';
import { userExists, getEntriesForPayPeriod, payPeriodSubmitted, submitTimecard } from '../utils/database';

const functions = Object.create({});

functions.submit = async (request, h) => {

    let submission = request.payload;
    const userId = request.params.userId;

    const server = require('../server.js');

    try {

        if (!(await userExists(userId))) {
            return Boom.notFound('User does not exist.');
        }

        const prevPayPeriod = await lastPayPeriod();
        const currPayPeriod = await currentPayPeriod();

        const entriesSnapshot = await getEntriesForPayPeriod(userId, prevPayPeriod);

        // This handles new users, and users that have not submitted time entries for an entire pay period or longer
        if (entriesSnapshot.empty) {

            const currentPPSubmitted = await payPeriodSubmitted(userId, currPayPeriod);
            if (currentPPSubmitted) {
                return h.response();
            }

            submission = await submitTimecard(userId, (currPayPeriod), submission);
            return h.response(submission).code(201);
        }

        // const start = new Date();

        // REFACTOR: Consider querying only for previous pay period and current pay period
        const userTimecardsRef = await server.db.collection('timecards').where('userId', '==', userId).get();
        const timecards = userTimecardsRef.docs.map((doc) => Object.assign(doc.data()));

        // Check if user has already submitted timecard for previous pay period
        for (let i = 0; i < timecards.length; ++i) {
            // Firebase stores Date objects as Timestamps
            const startDate = timecards[i].startDate.toDate();

            if (startDate.getDate() === prevPayPeriod.startDate.getDate() &&
                startDate.getMonth() === prevPayPeriod.startDate.getMonth() &&
                startDate.getFullYear() === prevPayPeriod.startDate.getFullYear()) {

                // If current pay period is submitted ignore request
                const currentPPSubmitted = await payPeriodSubmitted(userId, currPayPeriod);
                if (currentPPSubmitted) {
                    return h.response();
                }

                // Submitting timecard before end of pay period.
                submission = await submitTimecard(userId, currPayPeriod, submission);
                return h.response(submission).code(201);
            }
        }

        // const end = new Date();
        // console.log('Execution time: ', (end - start), ' ms');

        // Submitting timecard for previous pay period
        submission = await submitTimecard(userId, prevPayPeriod, submission);
        return h.response(submission).code(201);
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
