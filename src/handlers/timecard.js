import Boomify from 'boom';

const functions = Object.create({});

const goBackAYear = (date, past) => {

    if ((date.getDate() <= past) && (date.getMonth() === 0)) {
        return new Date(date.getFullYear() - 1, 11, (31 - (past - date.getDate())));
    }

    if (date.getDay() < past) {
        const temp = new Date(date.getFullYear(), date.getMonth(), 0);
        return new Date(date.getFullYear(), temp.getMonth(), temp.getDate() - (past - date.getDate()));
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - past);
};

const lastPayPeriod = () => {

    const today = new Date();
    // console.log(today.toLocaleDateString('en-US'));
    let sd = new Date();
    let ed = new Date();
    const day = today.getDay();

    if (day === 1) {
        sd = goBackAYear(today, 12);
        ed = goBackAYear(today,6);
    }
    else if (day === 2){
        sd = goBackAYear(today,13);
        ed = goBackAYear(today,7);
    }
    else if (day === 3){
        sd = goBackAYear(today,7);
        ed = goBackAYear(today,1);
    }
    else if (day === 4){
        sd = goBackAYear(today,8);
        ed = goBackAYear(today,2);
    }
    else if (day === 5){
        sd = goBackAYear(today,9);
        ed = goBackAYear(today,3);
    }
    else if (day === 6){
        sd = goBackAYear(today,10);
        ed = goBackAYear(today,4);
    }
    else if (day === 0){
        sd = goBackAYear(today,11);
        ed = goBackAYear(today,5);
    }

    const payPeriod = Object.create({});
    payPeriod.startDate = sd;
    payPeriod.endDate = ed;

    return payPeriod;
};

functions.submit = async (request, h) => {

    const timecardToSubmit = request.payload;
    const prevPayPeriod = await lastPayPeriod();
    const server = require('../server.js');

    try {
        const userTimecardsRef = await server.db.collection('timecards').where('userId', '==', timecardToSubmit.userId).get();
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
