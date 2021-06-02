const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const Requests = require('../../models/Requests');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/movies)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});

// redirecting "/admin/movies" route to the "/admin/movies/view-movies" route
router.get('/', (req, res) => {
    res.redirect('/admin/movies/view-movies');
});


// view-movies (get request)
router.get('/view-movies', (req, res) => {
    Movies.find( {} ).lean() // will find all movies (lean() is a handlebars thing)
    .then( (movies) => {
        Requests.find( {} ).lean()
        .then( (requests) => {
            res.render('admin/view-movies', { data: movies, requests: requests }); // passing all the data as parameters
        })
        .catch( () => {
            res.status(404).send('Failed to load the requests', error)
        });
    })
    .catch( (error) => res.status(404).send('Failed to load the movies', error));
});


// add-movie (get request)
router.get('/add-movie', (req, res) => {
    res.render('admin/add-movie');
});


// add-movie (post request)
router.post('/add-movie', (req, res) => {
    let photosArray = [];
    // if (req.files !== null) { // if at least one type of the images exist (either photos or poster)
        let photoObject = req.files.movie_photos;
        let posterObject = req.files.movie_poster;
        
        // if (typeof(photoObject) == "undefined" || typeof(posterObject) == "undefined") {
        //     res.redirect('back');
        // }
        posterObject.mv('./public/admin/img/posters/' + posterObject.name); // this moves the poster file to the server
        if (Object.keys(photoObject).length === 9) {
            if (photoObject[1]) {
                console.log('9 IMAGES UPLOADED');
                for (let i = 0; i < Object.keys(photoObject).length; i++) {
                    let photoObject = req.files.movie_photos[i];
                    photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // individually moving all the photo files to the server
                    photosArray.push(photoObject.name);
                }
            }
            else {
                console.log('JUST 1 IMAGE UPLOADED');
                let photoObject = req.files.movie_photos;
                photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // moving photo file to the server
                photosArray.push(photoObject.name);
            }
        }
        else if (Object.keys(photoObject).length > 0) {
            console.log('MORE THAN 1 BUT NOT 9 IMAGES UPLOADED');
            for (let i = 0; i < Object.keys(photoObject).length; i++) {
                let photoObject = req.files.movie_photos[i];
                photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // individually moving all the photo files to the server
                photosArray.push(photoObject.name);
            }
        }
    // }
    // else if (req.files === null) { // if no image exists at all (neither photos nor the poster)
    //     console.log('No image uploaded at all');
    //     res.redirect('back');
    // }
    
    let incomingData = req.body;

    let dataToSave = new Movies({
        name: incomingData.movie_name,
        description: incomingData.movie_desc, 
        runtime: incomingData.runtime, 
        videoQuality: incomingData.movie_quality, 
        yearReleased: incomingData.year, 
        videoLink: incomingData.youtube_video.replace('/watch?v=', '/embed/'),
        genre: incomingData.movie_genres,
        visibility: incomingData.visibility_status == 'Yes' || 'yes' ? 1 : 0,
        rating: "0.0",
        totalReviews: 0, 
        poster: req.files.movie_poster.name, 
        photos: photosArray, 
        totalNumberOfRatings: 0
    });

    // if (incomingData.movie_genres) {
        dataToSave.save()
        .then( (createdPost) => {
            req.flash('movieCreationSuccessful', `${ createdPost.name } created successfully`);
            res.redirect('/admin/movies/view-movies'); // Here, they will be able to see their recently added movie. You can also render and send a success message
        }).catch( (error) => {
            res.render('admin/add-movie', { error: 
                `Sorry! We could not add the movie. 
                It may be possible that you did not fill out some field. 
                Please make sure that you fill in all the fields. ${ error }`,
            });
        });
    // }
    // else {
    //     res.render('admin/add-movie', { error: 
    //         `Sorry! We could not add the movie. 
    //         It may be possible that you did not fill out some field. 
    //         Please make sure that you fill in all the fields`
    //     });
    // }
});

// edit-movie (get)
router.get('/edit-movie/:id', (req, res) => {
    let movieID = req.params.id;

    // fetching the movie by ID from the DB
    Movies.findOne({_id: ObjectID(movieID)}).lean()
    .then( (data) => {
        res.render('admin/edit-movie', {
            movie: data
        });
    })
    .catch( (error) => res.status(404).send('Failed to find the movie to edit from DB', error));
});


// edit-movie (post)
router.post('/edit-movie/:id', (req, res) => {
    let photosArray = [];
    
    let photoObject = req.files.movie_photos;
    let posterObject = req.files.movie_poster;
    posterObject.mv('./public/admin/img/posters/' + posterObject.name); // this moves the poster file to the server
    if (Object.keys(photoObject).length === 9) {
        
        
        if (photoObject[1]) {
            console.log('9 IMAGES UPLOADED');
            for (let i = 0; i < Object.keys(photoObject).length; i++) {
                let photoObject = req.files.movie_photos[i];
                photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // individually moving all the photo files to the server
                photosArray.push(photoObject.name);
            }
        }
        else {
            console.log('JUST 1 IMAGE UPLOADED');
            let photoObject = req.files.movie_photos;
            photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // moving photo file to the server
            photosArray.push(photoObject.name);
        }
    }
    else if (Object.keys(photoObject).length > 0) {
        console.log('MORE THAN 1 BUT NOT 9 IMAGES UPLOADED');
        for (let i = 0; i < Object.keys(photoObject).length; i++) {
            let photoObject = req.files.movie_photos[i];
            photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // individually moving all the photo files to the server
            photosArray.push(photoObject.name);
        }
    }
    
    let incomingData = req.body;
    let id = req.params.id;

    let dataToUpdate = {
        name: incomingData.movie_name,
        description: incomingData.movie_desc, 
        runtime: incomingData.runtime, 
        videoQuality: incomingData.movie_quality, 
        yearReleased: incomingData.year, 
        videoLink: incomingData.youtube_video.replace('/watch?v=', '/embed/'),
        genre: incomingData.movie_genres,
        visibility: incomingData.visibility_status == 'Yes' || 'yes' ? 1 : 0,
        // rating: 0.0, // don't want to touch this field in editing
        // totalReviews: 0, // don't wanna touch it
        poster: req.files.movie_poster.name, 
        photos: photosArray, 
        // totalNumberOfRatings: 0 // don't wanna touch this field while editing
    };
    Movies.findOneAndUpdate( {_id: ObjectID(id) }, dataToUpdate).lean()
    .then( (updatedMovie) => {
        req.flash('movieUpdationSuccessful', `${ updatedMovie.name } updated successfully`);
        res.redirect('/admin/movies/view-movies');
    })
    .catch( (error) => res.status(404).send('Failed to Update the Movie', error));
});


// delete-movie (get)
router.get('/delete-movie/:id', (req, res) => {
    let movieID = req.params.id;
    
    Movies.findOneAndDelete( {_id: ObjectID(movieID)} ).lean()
    .then( (deletedMovie) => {
        req.flash('movieDeletionSuccessful', `${ deletedMovie.name } deleted successfully`);
        res.redirect('back'); 
    })
    .catch( (error) => res.status(404).send('Failed to delete the movie', error));
});


// delete-request (get)
router.get('/delete-request/:id', (req, res) => {
    let requestID = req.params.id;
    
    Requests.findOneAndDelete( {_id: ObjectID(requestID)} ).lean()
    .then( (deletedRequest) => {
        req.flash('requestDeletionSuccessful', `Request for "${ deletedRequest.movieName }" deleted successfully`);
        res.redirect('back'); 
    })
    .catch( (error) => res.status(404).send('Failed to delete the request', error));
});

module.exports = router;