class User{
    constructor(id, googleToken, isActive, dateToRemove){

        this.id = id; //number
        this.googleToken = googleToken; //string
        this.isActive = isActive; //bool
        this.dateToRemove = dateToRemove; //DateTime
    }
}

export default User;



// return {

//     doc: Sinon.stub().withArgs('9999').resolves(() => {

//         set: Sinon.stub();
//     })
// };
// return {
//     doc: Sinon.stub().withArgs('9999').callsFake(() => {

//         return {

//             set: Sinon.stub()
//         };
//     })
// };
