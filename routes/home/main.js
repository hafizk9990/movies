const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const Users = require('../../models/Users');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');
const crypto = require('crypto');

// Making sure that if you come to this file from admin, you do not inherit admin's layout, rather you fall back on default layout which for home
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/home/)
    req.app.locals.layout = 'index-home'; // and reset the default layout for all these routes to index-home
    next();
});


// redirecting "/" route to the "/home" route
router.get('/', (req, res) => {
    res.redirect('home');
});


// homepage
router.get('/home', (req, res) => {
    Movies.find().sort( {_id: 1} ).limit(7).lean()
    .then( (movies) => {
        res.render('home/page-content', { carousalData: movies }); // This will be sent dynamically from ther server to index-home.handlebars file
    })
    .catch( (error) => {
        res.status(404).send('Could not find top 6 movies for the carousal', error);
    });
});


// sign-in (get)
router.get('/signin', (req, res) => {
    res.render('home/signin', { layout: false }); // This will be sent dynamically from ther server to signin.handlebars file
});


// sign-in (post)
router.post('/signin', (req, res) => {
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


// sign-up (get)
router.get('/signup', (req, res) => {
    res.render('home/signup', { layout: false }); // This will be sent dynamically from ther server to signup.handlebars file
});


// sign-up (post)
router.post('/signup', (req, res) => {
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
                console.log('NOT INSERTED', error); 
                res.status(404).send('Sign up failed. Please try again');
            });
        }
        else {
            req.flash('alreadySignedUp', `${ req.body.fName }, you are already registered. No need to sign up again`);
            res.redirect('/signin');
        }
    }).catch( (error) => {
        req.status(404).send('Some bad thing happened. The whole process failed. Please try again', error);
    });
});


// faq
router.get('/home/faq', (req, res) => {
    res.render('home/faq', { layout: false }); // Will add layout in some other way. This way gives me trouble
});


module.exports = router