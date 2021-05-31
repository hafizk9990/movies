const express = require('express');
const handlebarsEngine = require('express-handlebars');
const Handlebars = require('handlebars');
require('./mongodb/db');
const bp = require('body-parser'); // this boy is deprecated. Now, we use express.json() and express.urlencoded( {} )
const { 
    select, select2, forOtherImagesofViewMovies, 
    forEditMovies, genreForMovieDetails, moviePhotoRequest, 
    countPhotos, visibilityStatus, generateHomeGenreNamesDynamicallyforNonMobile,
    generateHomeGenreNamesDynamicallyforMobile, generateHomeMoviesDynamically,
    dateHelper, movieRating, createFullName
} = require('./helper/handlebars-helpers');
const uploadFiles = require('express-fileupload');
const sessions = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');


// creating server
const app = express();
app.listen(64000, () => console.log('NodeJS server running now'));


// setting up our middleware
app.use(methodOverride('_method')); // to get router.put and router.delete functionality for updation and deletion. This overrides .post with .delete / .put
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadFiles({ useTempFiles: true }));// setting up file uploading functionality
app.use(flash());
app.use(sessions({
    secret: 'uzair9990', 
    resave: true,
    saveUninitialized: true, 
}));


// overriding request methods of to get put and delete functionality
app.use( (req, res, next) => {
    if (req.query._method == 'DELETE')
        req.method = 'DELETE';
    else if (req.query._method == 'PUT') 
        req.method = 'PUT';
    next(); 
});


// setting up flash response messages
app.use( (req, res, next) => {
    res.locals.movieCreationSuccessful = req.flash('movieCreationSuccessful');
    res.locals.movieDeletionSuccessful = req.flash('movieDeletionSuccessful');
    res.locals.movieUpdationSuccessful = req.flash('movieUpdationSuccessful');
    res.locals.signUpSuccess = req.flash('signUpSuccess');
    res.locals.alreadySignedUp = req.flash('alreadySignedUp');
    res.locals.wrongEmailSignIn = req.flash('wrongEmailSignIn');
    res.locals.wrongPasswordSignIn = req.flash('wrongPasswordSignIn');
    res.locals.genreAdditionSuccessful = req.flash('genreAdditionSuccessful');
    res.locals.genreDeletionSuccessful = req.flash('genreDeletionSuccessful');
    res.locals.duplicateGenreAdditionFailed = req.flash('duplicateGenreAdditionFailed');
    res.locals.userDeletionSuccessful = req.flash('userDeletionSuccessful');
    res.locals.userMadeAdmin = req.flash('userMadeAdmin');
    res.locals.userMadeNonAdmin = req.flash('userMadeNonAdmin');
    res.locals.publicReviewAdded = req.flash('publicReviewAdded');
    res.locals.reviewDeletionSuccessful = req.flash('reviewDeletionSuccessful');
    res.locals.movieRequestAddedSuccessfully = req.flash('movieRequestAddedSuccessfully');
    res.locals.requestedMovieRepeatedely = req.flash('requestedMovieRepeatedely');
    res.locals.requestDeletionSuccessful = req.flash('requestDeletionSuccessful');
    
    next();
});


// setting up our templating engine, default layout and helper functions
app.set('view engine', 'handlebars'); // tell NodeJS what is your templating engine (express-handlebars)
app.engine('handlebars', handlebarsEngine({
    defaultLayout: 'index-home',  // Tell it what is the default file from the layouts (EXHBR peeks here by default) folder (views/layouts/index-home)
    helpers: {
        select: select, 
        select2: select2, 
        forOtherImagesofViewMovies: forOtherImagesofViewMovies,
        forEditMovies: forEditMovies,
        genreForMovieDetails: genreForMovieDetails,
        moviePhotoRequest: moviePhotoRequest, 
        countPhotos: countPhotos, 
        visibilityStatus: visibilityStatus,
        generateHomeGenreNamesDynamicallyforNonMobile: generateHomeGenreNamesDynamicallyforNonMobile,
        generateHomeGenreNamesDynamicallyforMobile: generateHomeGenreNamesDynamicallyforMobile,
        generateHomeMoviesDynamically: generateHomeMoviesDynamically,
        dateHelper: dateHelper,
        movieRating: movieRating,
        createFullName: createFullName,
    }
}));


// setting up all our routes (admin)
app.use('/', require('./routes/home/main'));
app.use('/admin', require('./routes/admin/main'));
app.use('/admin/movies', require('./routes/admin/movies'));
app.use('/admin/genres', require('./routes/admin/genres'));
app.use('/admin/view-users', require('./routes/admin/users'));
app.use('/admin/view-reviews', require('./routes/admin/reviews'));
// setting up all our routes (home)
app.use('/home/movies', require('./routes/home/movies'));
app.use('/signin', require('./routes/home/signin'));
app.use('/signup', require('./routes/home/signup'));
app.use('/home/movies/reviews', require('./routes/home/reviews'));


// serving template files for home
app.use('/css', express.static('./public/home/css'));
app.use('/fonts', express.static('./public/home/fonts'));
app.use('/icon', express.static('./public/home/icon'));
app.use('/img', express.static('./public/home/img'));
app.use('/js', express.static('./public/home/js'));


// serving template files for the admin
app.use('/css', express.static('./public/admin/css'));
app.use('/fonts', express.static('./public/admin/fonts'));
app.use('/img', express.static('./public/admin/img'));
app.use('/js', express.static('./public/admin/js'));
app.use('/scss', express.static('./public/admin/scss'));


// creating custom requests for images of movie posters and photos
app.use('/posters', express.static('./public/admin/img/posters'));
app.use('/photos', express.static('./public/admin/img/photos/movie-photos'));
