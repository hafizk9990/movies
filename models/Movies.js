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
        type: String, 
        required: true
    },  
    totalReviews: {
        type: Number, 
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
    reviews: [ // an array of objects. Each object is a signel review of the movie
        {
            reviewTitle: {
                type: String, 
                required: true
            }, 
            reviewAuthor: {
                type: String, 
                required: true
            }, 
            reviewContent: {
                type: String, 
                required: true
            }, 
            reviewRating: {
                type: String, 
                required: true
            }, 
            reviewLiked: {
                type: Number, 
                required: true
            }, 
            reviewDisliked: {
                type: Number, 
                required: true
            }, 
            reviewDateCreated: {
                type: String, 
                required: true
            }, 
            reviewTimeCreated: {
                type: String, 
                required: true
            }
        }
    ]
}

const MoviesModel = mongoose.model('movies', moviesSchema);
module.exports = MoviesModel;
