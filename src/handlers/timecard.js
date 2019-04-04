import Boomify from 'boom';
import Boom from 'boom';
import { lastPayPeriod, currentPayPeriod } from '../utils/payperiod';
import { userExists, getEntriesForPayPeriod, payPeriodSubmitted, submitTimecard } from '../utils/database';

const functions = Object.create({});

functions.submit = async (request, h) => {

    let submission = request.payload;
    const userId = request.params.userId;

    //const server = require('../server.js');

    try {

        if (!(await userExists(userId))) {
            return Boom.notFound('User does not exist.');
        }

        const prevPayPeriod = await lastPayPeriod();
        const currPayPeriod = await currentPayPeriod();

        const entriesSnapshot = await getEntriesForPayPeriod(userId, prevPayPeriod);

        // Handles new users, and users that have not submitted time entries for an entire pay period or longer
        if (entriesSnapshot.empty) {

            const currentPPSubmitted = await payPeriodSubmitted(userId, currPayPeriod);
            if (currentPPSubmitted) {
                return h.response();
            }

            submission = await submitTimecard(userId, (currPayPeriod), submission);
            return h.response(submission).code(201);
        }

        // Check if user has already submitted timecard for previous pay period
        const prevPPSubmitted = await payPeriodSubmitted(userId, prevPayPeriod);
        if (prevPPSubmitted) {

            // If current pay period is submitted ignore request
            const currentPPSubmitted = await payPeriodSubmitted(userId, currPayPeriod);
            if (currentPPSubmitted) {
                return h.response();
            }

            // Submitting timecard before end of pay period.
            submission = await submitTimecard(userId, currPayPeriod, submission);
            return h.response(submission).code(201);
        }

        // Submitting timecard for previous pay period
        submission = await submitTimecard(userId, prevPayPeriod, submission);
        return h.response(submission).code(201);
    }
    catch (error) {
        return new Boomify(error);
    }
};

export default functions;
