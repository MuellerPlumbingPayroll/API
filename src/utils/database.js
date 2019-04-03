// Makes a request to firebase for a user document with the provided userId.
export const userExists = async (userId) => {

    const server = require('../server.js');

    try {

        const userRef = await server.db.collection('users').doc(userId).get();

        if (userRef.exists) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
    catch (err) {
        return Promise.reject(err);
    }
};

export const submitTimecard = async (userId, payPeriod, submission) => {

    const server = require('../server.js');

    submission.userId = userId;
    submission.startDate = payPeriod.startDate;
    submission.endDate = payPeriod.endDate;

    try {
        await server.db.collection('timecards').add(submission);
        Promise.resolve(submission);
    }
    catch (error) {
        Promise.reject(error);
    }
};

export const getEntriesForPayPeriod = async (userId, payPeriod) => {

    const server = require('../server.js');

    try {

        const query = await server.db.collection('users').doc(userId).collection('entries')
            .where('timeCreated', '>=', payPeriod.startDate)
            .where('timeCreated', '<=', payPeriod.endDate);

        const entriesSnapshot = query.get();

        return Promise.resolve(entriesSnapshot);
    }
    catch (err) {
        return Promise.reject(err);
    }
};

// Checks if a user has submitted a time card for the given pay period
export const payPeriodSubmitted = async (userId, payPeriod) => {

    const server = require('../server.js');

    try {

        const query = await server.db.collection('timecards')
            .where('userId', '==', userId)
            .where('startDate', '==', payPeriod.startDate)
            .where('endDate', '==', payPeriod.endDate);

        const timecardSnapshot = await query.get();
        if (!timecardSnapshot.empty) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
    catch (err) {
        return Promise.reject(err);
    }
};
