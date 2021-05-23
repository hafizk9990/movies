const mongoose = require('mongoose');

let moviesSchema = 
{
    name: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }, 
    runtime: {
        type: String, 
        required: true
    }, 
    dateCreated: {
        type: String, 
        required: true
    }, 
    videoQuality: {
        type: String, 
        required: true
    }, 
    yearReleased: {
        type: String, 
        required: true
    }, 
    videoLink: {
        type: String, 
        required: true
    }, 
    genre: {
        type: [String], 
        required: true,
    },
    visibility: {
        type: Boolean, 
        required: true
    }, 
    rating: {
        type: Number, 
        required: true
    },  
    totalReviews: {
        type: Number, 
        required: true
    }, 
    author: {
        type: String, 
        required: true
    }, 
    poster: {
        type: String, 
        required: true
    }, 
    photos: {
        type: [String], 
        required: true
    },
    // reviews: {
    //     title: {
    //         type: String, 
    //         required: true
    //     }, 
    //     author: {
    //         type: String, 
    //         required: true
    //     }, 
    //     body: {
    //         type: String, 
    //         required: true
    //     }, 
    //     rating: {
    //         type: String, 
    //         required: true
    //     }, 
    //     liked: {
    //         type: Number, 
    //         required: true
    //     }, 
    //     disliked: {
    //         type: Number, 
    //         required: true
    //     }, 
    //     dateCreated: {
    //         type: String, 
    //         required: true
    //     }
    // }
}

const MoviesModel = mongoose.model('movies', moviesSchema);
module.exports = MoviesModel;
