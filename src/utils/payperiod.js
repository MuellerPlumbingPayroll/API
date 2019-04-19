export const lastPayPeriod = () => {

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

    //
    sd.setHours(0);
    sd.setMinutes(0);
    sd.setSeconds(0);
    // This needs to be 11:59:59 in central time not local
    ed.setHours(23);
    ed.setMinutes(59);
    ed.setSeconds(59);

    const payPeriod = Object.create({});
    payPeriod.startDate = toLocalTime(sd);
    payPeriod.endDate = toLocalTime(ed);

    return payPeriod;
};

export const currentPayPeriod = () => {

    const goForwardAYear = (date, forward) => {

        if (((date.getDate() + forward) > 31) && (date.getMonth() === 12)){
            return new Date(date.getFullYear() + 1, 0, forward - (31 - date.getDate()));
        }

        const temper = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if ((date.getDay() + forward) > (temper.getDate())){
            ;     return new Date(date.getFullYear(), date.getMonth() + 1, forward - (date.getDate() - date.getDate()));
        }

        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + forward);

    };

    const today = new Date();
    const day = today.getDay();
    let sd = new Date();
    let ed = new Date();

    if (day === 0){
        sd = goForwardAYear(today, (-4));
        ed = goForwardAYear(today, 2);
    }
    else if (day === 1){
        sd = goForwardAYear(today,(-5));
        ed = goForwardAYear(today,1);
    }
    else if (day === 2){
        sd = goForwardAYear(today,(-6));
        ed = goForwardAYear(today,0);
    }
    else if (day === 3){
        sd = goForwardAYear(today,(0));
        ed = goForwardAYear(today, 6);
    }
    else if (day === 4){
        sd = goForwardAYear(today,(-1));
        ed = goForwardAYear(today,5);
    }
    else if (day === 5){
        sd = goForwardAYear(today,(-2));
        ed = goForwardAYear(today,4);
    }
    else if (day === 6){
        sd = goForwardAYear(today,(-3));
        ed = goForwardAYear(today,3);
    }

    //
    sd.setHours(0);
    sd.setMinutes(0);
    sd.setSeconds(0);
    // This needs to be 11:59:59 in central time not local
    ed.setHours(23);
    ed.setMinutes(59);
    ed.setSeconds(59);

    const payPeriod = Object.create({});
    payPeriod.startDate = toLocalTime(sd);
    payPeriod.endDate = toLocalTime(ed);

    return payPeriod;
};

//
const toLocalTime = (time) => {

    const millisecondsPerMinute = 60000;
    const millisecondsPerHour = 3600000;
    const offset = '-5';
    const utc = time.getTime() + (time.getTimezoneOffset() * millisecondsPerMinute);
    return new Date(utc + (millisecondsPerHour * offset));
};
