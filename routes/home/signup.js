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


// sign-up (get)
router.get('/', (req, res) => {
    res.render('home/signup', { layout: false }); // This will be sent dynamically from ther server to signup.handlebars file
});


// sign-up (post)
router.post('/', (req, res) => {
    Users.findOne( {email: req.body.email }).then( (user) => {
        if (!user) {
            let objectToInsert = new Users({
                firstName: req.body.fName,
                lastName: req.body.lName,
                email: req.body.email,
                password: crypto.createHash('sha256').update(req.body.pass).digest('base64'),
                username: req.body.username,
                userType: 'Non-Admin',
            });

            objectToInsert.save()
            .then( (response) => { 
                req.flash('signUpSuccess', `Sign up successful, ${ response.firstName }. Sign in to continue`);
                res.redirect('/signin');
            })
            .catch( (error) => { 
                res.render('errors/server', { exactError: error });
            });
        }
        else {
            req.flash('alreadySignedUp', `${ req.body.fName }, you are already registered. No need to sign up again`);
            res.redirect('/signin');
        }
    }).catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});

module.exports = router