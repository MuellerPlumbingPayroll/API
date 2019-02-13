const functions = Object.create({});

functions.addCostCode = async (request, h) => {
    var code = request.payload.code;
    var description = request.payload.description;

    var server = require('../server.js');
    console.log("code: ", code);
    
    // Updates doc if it exists otherwise the doc is created. Same goes for a collection.
    return await server.db.collection("cost-codes").doc(String(code)).set({
        code: code,
        description: description
    }).then(function() {
        console.log('Doc successfully written.');
        // Should return a 201
        return 'SUUUUUPPP'
    }).catch(err => {
        console.error("Error writting document: ", err);
        // return 400
        return 'Could not create cost-code.'
    }) 
}

functions.getCostCodes = async (request, h) => {

    var server = require('../server.js');

    return await server.db.collection('cost-codes').get().then(snapshot => {
        if(snapshot.empty)
            return {};
        else
            return snapshot.docs.map(doc => Object.assign({id: doc.id}, doc.data()));

    }).catch(err => {
        console.warn("Error getting documents: ", err)
        return 'Error getting documents: '; // Should probably return 400... BOOM!
    });
}

export default functions;