const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
// const Reviews = require('../../models/Reviews');
const Genres = require('../../models/Genres');
const Users = require('../../models/Users');
const mongoose = require('mongoose');
const { ObjectID, ObjectId } = require('bson');
const crypto = require('crypto');
const { update } = require('../../models/Movies');


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
    
    let reviewRating = (Math.floor(100 * req.body.reviewRating) / 100).toFixed(1); // restricting to 1 DP

    let movieReview = {
        reviewTitle: req.body.reviewTitle,
        reviewAuthor: 'Random Author',
        reviewContent: req.body.reviewBody, 
        reviewRating: reviewRating,
        reviewLiked: 0, 
        reviewDisliked: 0,
        reviewDateCreated: today,
        reviewTimeCreated: strTime
    }
    
    Movies.findOne( {_id: ObjectID(req.params.id)} )
    .then( (movie) => {
        let rating = parseFloat(movie.rating);
        let updatedRating = rating + parseFloat(reviewRating);
        let updatedRatingRestrictedToOneDecimalPlace = ((Math.floor(100 * updatedRating) / 100).toFixed(1));
        let totalNumberOfRatings = movie.totalNumberOfRatings;
        let updatedTotalNumberOfRatings = totalNumberOfRatings + 1;

        // whenever I update rating and totalNumber of rating together, 
        // rating does not get updated at all. So, I have to do it in two goes, not one

        Movies.findOneAndUpdate( {_id: ObjectID(req.params.id) }, { 
            $set: { rating: (updatedRatingRestrictedToOneDecimalPlace) }, 
            $push: { reviews: movieReview },
        }).then( () => {
            Movies.findOneAndUpdate( {_id: ObjectID(req.params.id) }, { 
                $set: { totalNumberOfRatings: updatedTotalNumberOfRatings }
            }).then( () => {
                req.flash('publicReviewAdded', `Review added successfully`); 
                res.redirect('back');
            });
        })
        .catch( (error) => {
            res.status(400).send('Sorry, something went wrong', error);
        });
    }).catch( (error) => {
        res.status(400).send('Sorry, something went wrong', error);
    }); 
});

router.get('/vote/:voteID', (req, res) => {
    const [voteValue, reviewID, movieID] = req.params.voteID.split('*');
    
    Movies.findOne( {_id: ObjectID(movieID)} )
    .then( (movie) => {
        let reviewExtracted = movie.reviews.find(x => x._id == reviewID); // returns back pointer to the object in the original array (movie.reviews)
        voteValue == 'up' ? reviewExtracted.reviewLiked++ : reviewExtracted.reviewDisliked++; // updates (via pointer) the actual array's object
        Movies.findOneAndUpdate({ _id: ObjectID(movieID) }, {
            $set: { reviews: movie.reviews } // set overwrites everything and sets new updated value (don't always set) 
        }).then( () => {
            res.status(200).send('Thumbs updated successfully');
        }).catch( (error) => {
            res.status(400).send(error);
        });
    });
});

module.exports = router;
