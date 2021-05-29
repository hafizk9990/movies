const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/movies)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});


// view-reviews (get request)
router.get('/', (req, res) => {
    Movies.find( {} ).lean()
    .then( (allMovies) => {
        res.render('admin/view-reviews', { movies: allMovies });
    })
    .catch( (error) => {
        res.status(400).send('Someting went wrong', error);
    });
});


// view-reviews/delete/movieID*reviewID
router.delete('/delete/:id', (req, res) => {
    let reviewIDs = req.params.id.split('*'); // splitting movieID from reviewID using an *
    let movieID = reviewIDs[0];
    let reviewID = reviewIDs[1];

    Movies.findOneAndUpdate({ 
        _id: ObjectID(movieID) 
    }, { 
        $pull: { // movie id 
            reviews: { 
                _id: ObjectID(reviewID) // review id
            } 
        }}
    ).then( () => {
        req.flash('reviewDeletionSuccessful', `Successfully deleted movie review`);
        res.redirect('back');
    }).catch( (error) => {
        console.log('bar');
        res.status(400).send('Error deleting review', error);
    });
});

module.exports = router;
