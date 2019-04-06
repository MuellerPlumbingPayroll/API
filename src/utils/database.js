// Makes a request to firebase for a user document with the provided userId.
export const userExists = async (userId) => {

    const server = require('../server.js');

    try {
        const userRef = await server.db.collection('users').doc(userId).get();

        if (userRef.exists) {
            return true;
        }

        return false;
    }
    catch (err) {
        // return Promise.reject(err);
        throw err;
    }
};

export const submitTimecard = async (userId, payPeriod, submission) => {

    const server = require('../server.js');

    submission.userId = userId;
    submission.startDate = payPeriod.startDate;
    submission.endDate = payPeriod.endDate;

    try {
        await server.db.collection('timecards').add(submission);
        return Promise.resolve(submission);
    }
    catch (error) {
        return Promise.reject(error);
    }
};

export const getEntriesForPayPeriod = async (userId, payPeriod) => {

    const server = require('../server.js');

    try {

        const query = await server.db.collection('users').doc(userId).collection('entries')
            .where('jobDate', '>=', payPeriod.startDate)
            .where('jobDate', '<=', payPeriod.endDate);

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

export const getUser = async (userId) => {

    const server = require('../server.js');

    try {

        const userSnapshot = await server.db.collection('users').doc(userId).get();
        let user = null;

        if (userSnapshot.exists) {
            user = userSnapshot.data();
        }

        return user;
    }
    catch (err) {
        throw err;
    }
};

export const getSubmission = async (userId, payPeriod) => {

    const server = require('../server.js');

    try {
        const submissionSnapshot = await server.db.collection('timecards')
            .where('userId', '==', userId)
            .where('startDate', '==', payPeriod.startDate)
            .where('endDate', '==', payPeriod.endDate).get();

        // For some reason I could not just put submissionSnapshot.empty as if condition...
        // Evaluated to true, but would not take branch...
        const isEmpty = submissionSnapshot.empty;
        if (isEmpty) {
            return null;
        }

        const submission = submissionSnapshot.docs.map((doc) => Object.assign(doc.data()));

        return submission[0].injured;
    }
    catch (err) {
        throw err;
    }
};


