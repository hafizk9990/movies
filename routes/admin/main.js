const express = require('express');
const router = express.Router();
let Movies = require('../../models/Movies');
let Genres = require('../../models/Genres');
let Users = require('../../models/Users');
let Requests = require('../../models/Requests');

// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/)
    
    // checking if you are logged in or not. If not, you go straight to the login page
    if (req.session.isAuth) {
        req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
        next();
    }
    else {
        res.redirect('/signin');
    }
});

router.get('/', async (req, res) => {
    let totalMovies = await Movies.count().lean();
    let totalGenres = await Genres.count().lean();
    let totalUsers = await Users.count().lean();
    let totalRequests = await Requests.count().lean();
    let ourUser = await Users.findOne( {email: req.session.email} );

    res.render('admin/page-content', {
        totalMovies: totalMovies, 
        totalMovieRequests: totalRequests, 
        totalGenres: totalGenres, 
        totalUsers: totalUsers,
        email: req.session.email,
        name: ourUser.firstName + " " + ourUser.lastName
    });
});

module.exports = router;
