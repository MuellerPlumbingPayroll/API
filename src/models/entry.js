class Entry{
    constructor(hours,
        userId,
        UTCtime,
        jobType,
        jobDescription,
        costCode,
        timeWorked,
        timeCreated,
        latitudeCreated,
        longitudeCreated,
        id){

        this.id = id; //number
        this.hours = hours; //number
        this.userId = userId; //number
        this.UTCtime = UTCtime; //DateTime
        this.jobType = jobType; //JobType
        this.jobDescription = jobDescription; //string
        this.costCode = costCode; //string
        this.timeWorked = timeWorked; //DateTime
        this.timeCreated = timeCreated; //DateTime
        this.timeUpdated = timeCreated; //DateTime
        this.latitudeCreated = latitudeCreated; //string or number we will see
        this.latitudeUpdated = latitudeCreated; //string or number we will see
        this.longitudeCreated = longitudeCreated; //string or number we will see
        this.longitudeUpdated = longitudeCreated; //string or number we will see
    }
}

const JobType = Object.freeze({
    CONSTRUCTION:   Symbol('construction'),
    SERVICE:  Symbol('service'),
    OTHER: Symbol('other')
});
export default { Entry,JobType };
