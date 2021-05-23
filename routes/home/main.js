const express = require('express');
const router = express.Router();

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
    res.render('home/page-content'); // This will be sent dynamically from ther server to index-home.handlebars file
});

// sign-in
router.get('/signin', (req, res) => {
    res.render('home/signin', { layout: false }); // This will be sent dynamically from ther server to signin.handlebars file
});

// sign-up
router.get('/signup', (req, res) => {
    res.render('home/signup', { layout: false }); // This will be sent dynamically from ther server to signup.handlebars file
});

// faq
router.get('/faq', (req, res) => {
    res.render('home/faq', { layout: false }); // Will add layout in some other way. This way gives me trouble
});

// movie-details (get)
router.get('/home/movie-details/:id', (req, res) => {
    res.status(200).send('Yo! Working!');
});

module.exports = router