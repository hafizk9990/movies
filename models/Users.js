const mongoose = require('mongoose');

let usersSchema = 
{
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
    },
    password: {
        type: String, 
        required: true
    }, 
    userType: {
        type: String,
        default: 'Non-Admin', // vs "Admin"
        required: true
    }
}

const MoviesModel = mongoose.model('users', usersSchema);
module.exports = MoviesModel;
