const express = require('express');
const router = express.Router();
let Movies = require('../../models/Movies');
let Genres = require('../../models/Genres');
let Users = require('../../models/Users');
let Requests = require('../../models/Requests');

// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});

// admin's homepage
router.get('/', async (req, res) => {
    Movies.count().lean()
    .then( (totalMovies) => {
        Genres.count().lean()
        .then( (totalGenres) => {
            Users.count().lean()
            .then( (totalUsers) => {
                Requests.count().lean()
                .then( (totalRequests) => {
                    res.render('admin/page-content', {
                        totalMovies: totalMovies, 
                        totalMovieRequests: totalRequests, 
                        totalGenres: totalGenres, 
                        totalUsers: totalUsers
                    });
                }).catch( (error) => {
                    res.render('errors/server', { exactError: error });
                });
            }).catch( (error) => {
                res.render('errors/server', { exactError: error });
            });
        }).catch( (error) => {
            res.render('errors/server', { exactError: error });
        });
    }).catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});


module.exports = router;
