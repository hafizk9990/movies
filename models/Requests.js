const mongoose = require('mongoose');

let requestsSchema = 
{
    movieName: {
        type: String, 
        required: true
    }, 
    requester: {
        firstName: {
            type: String, 
            required: true
        }, 
        lastName: {
            type: String, 
            required: true
        }, 
        email: {
            type: String, 
            required: true
        }
    }
}

const RequestsModel = mongoose.model('requests', requestsSchema);
module.exports = RequestsModel;
