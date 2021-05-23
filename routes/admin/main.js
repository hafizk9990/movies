const express = require('express');
const router = express.Router();

// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});

// admin's homepage
router.get('/', (req, res) => {
    res.render('admin/page-content');
});

// add-genre
router.get('/add-genre', (req, res) => {
    res.render('admin/add-genre');
});

// view-reviews (get request)
router.get('/view-reviews', (req, res) => {
    res.render('admin/view-reviews');
});

// add-user (get request)
router.get('/add-user', (req, res) => {
    res.render('admin/add-user', { layout: false });
});

// view-user (get request)
router.get('/view-user', (req, res) => {
    res.render('admin/view-user');
});

module.exports = router
