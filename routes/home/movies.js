const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// Making sure that if you come to this file from admin, you do not inherit admin's layout, rather you fall back on default layout which for home
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/home/)
    req.app.locals.layout = 'empty-file'; // and reset the default layout for all these routes to index-home
    next();
});


router.get('/', (req, res) => {
    res.status(200).send('All movies are here');
});


// localhost:64000/home/movies/:id
router.get('/:id', (req, res) => {
    let movieID = req.params.id;

    // fetching the movie by ID from the DB
    Movies.findOne({_id: ObjectID(movieID)}).lean()
    .then( (data) => {
        res.render('home/movie-details', { movie: data });
    })
    .catch( (error) => res.status(404).send('Failed to find the movie to edit from DB', error));
});


module.exports = router;