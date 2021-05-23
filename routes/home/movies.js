const express = require('express');
const router = express.Router();

// Making sure that if you come to this file from admin, you do not inherit admin's layout, rather you fall back on default layout which for home
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/home/)
    req.app.locals.layout = 'index-home'; // and reset the default layout for all these routes to index-home
    next();
});


// // movie-details (get)
// router.get('/movie-details/:name', (req, res) => {
//     res.status(200).send('Yo! Working!');
// });

module.exports = router