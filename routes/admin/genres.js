const express = require('express');
const router = express.Router();
const Genres = require('../../models/Genres');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/movies)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});


// genres (get)
router.get('/', (req, res) => {
    // if (req.session.role === 'Admin') {
        
    Genres.find( {} ).lean()
    .then( (allGenres) => {
        res.render('admin/genres', { data: allGenres });
    })
    .catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
    // }
    // else {
    //     res.render('home/404', { layout: false });
    // }
});


// genres (get) to delete
router.get('/delete-genre/:id', (req, res) => {
    let id = req.params.id;
    
    Genres.findOneAndDelete( { _id: ObjectID(id) } ).lean()
    .then( (deletedValue) => {
        req.flash('genreDeletionSuccessful', `Successfully deleted genre "${ deletedValue.name }"`);
        res.redirect('back');
    })
    .catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});


// genres (post)
router.post('/', (req, res) => {
    Genres.findOne( {name: req.body.genreName} )
    .then( (genre) => {
        if (! genre) {
            let genreToAdd = new Genres({
                name: req.body.genreName
            });
            genreToAdd.save().then( (success) => {
                req.flash('genreAdditionSuccessful', `Successfully added genre "${ success.name }"`);
                res.redirect('back');
            }).catch( (error) => {
                res.render('errors/server', { exactError: error });
            });
        } 
        else {
            req.flash('duplicateGenreAdditionFailed', `Oops! Genre "${ req.body.genreName }" already exists`);
            res.redirect('back');
        }
    }).catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});

module.exports = router;