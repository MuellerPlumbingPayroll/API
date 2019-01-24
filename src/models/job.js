class Entry{
    constructor(hours, userId){

        this.hours = hours;
        this.userId = userId;
    }

}

const JobType = Object.freeze({
    CONSTRUCTION:   Symbol('construction'),
    SERVICE:  Symbol('service'),
    OTHER: Symbol('other')
});


export default { Entry,JobType };
