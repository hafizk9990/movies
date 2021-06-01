const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const Genres = require('../../models/Genres');
const Users = require('../../models/Users');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Making sure that if you come to this file from admin, you do not inherit admin's layout, rather you fall back on default layout which for home
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/home/)
    req.app.locals.layout = 'index-home'; // and reset the default layout for all these routes to index-home
    next();
});


// sign-in (get)
router.get('/', (req, res) => {
    res.render('home/signin', { layout: false }); // This will be sent dynamically from ther server to signin.handlebars file
});


// sign-in (post)
router.post('/', (req, res, next) => {
    Users.findOne({ email: req.body.email }).then( (user) => {
        if (crypto.createHash('sha256').update(req.body.pass).digest('base64') == user.password) {
            if (user.userType == 'Non-Admin') {
                req.session.email = req.body.email;
                req.session.role = 'Non-Admin';

                res.redirect('/home');
            }
            else if (user.userType == 'Admin') {
                req.session.email = req.body.email;
                req.session.role = 'Admin';

                // req.session.cookie = '12345';

                res.redirect('/admin');
            }
        }
        else {
            req.flash('wrongPasswordSignIn', `Sorry, the password did not match`);
            res.redirect('back');
        }
    }).catch( () => {
        req.flash('wrongEmailSignIn', `Sorry, this email address is not registered with us`);
        res.redirect('back');
    });
});


module.exports = router