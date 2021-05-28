const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const Genres = require('../../models/Genres');
const Users = require('../../models/Users');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');
const crypto = require('crypto');


// Making sure that if you come to this file from admin, you do not inherit admin's layout, rather you fall back on default layout which for home
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/home/)
    req.app.locals.layout = 'index-home'; // and reset the default layout for all these routes to index-home
    next();
});

router.put('/:id', (req, res) => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;

    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let ampm = hours >= 12 ? 'PM (Pakistan Standard Time)' : 'AM (Pakistan Standard Time)';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    let movieReview = {
        // reviewID: Math.floor(Math.random() * 10000000000) + 1, 
        reviewTitle: req.body.reviewTitle,
        reviewAuthor: 'Random Author', 
        reviewContent: req.body.reviewBody, 
        reviewRating: (Math.floor(100 * req.body.reviewRating) / 100).toFixed(1), // restricting to 2 DPs
        reviewLiked: 0, 
        reviewDisliked: 0,
        reviewDateCreated: today,
        reviewTimeCreated: strTime
    }

    Movies.updateOne( {_id: ObjectID(req.params.id) }, {
        $push: { 
            reviews: movieReview // append review to the reviews array
        }
    }).then( (updateMovie) => {
        
        // update movie rating here
        // check if that is the updated movie's array
        
        req.flash('publicReviewAdded', `Your review has been received. Thank you!`);
        res.redirect('back');
    }).catch( (error) => {
        res.status(400).send('Could not add review. Damn it!', error);
    });
});

module.exports = router