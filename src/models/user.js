class User{
    constructor(id, googleToken, isActive, dateToRemove){

        this.id = id; //number
        this.googleToken = googleToken; //string
        this.isActive = isActive; //bool
        this.dateToRemove = dateToRemove; //DateTime
    }
}

export default User;
