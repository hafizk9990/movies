const express = require('express');
const router = express.Router();
const Movies = require('../../models/Movies');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/movies)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});


// view-movies (get request)
router.get('/view-movies', (req, res) => {
    Movies.find( {} ).lean() // will find all movies (lean() is a handlebars thing)
    .then( (movies) => {
        res.render('admin/view-movies', { data: movies }); // passing all the data as parameters
    })
    .catch( (error) => res.status(404).send('Failed to load the movies', error));
});


// add-movie (get request)
router.get('/add-movie', (req, res) => {
    res.render('admin/add-movie');
});


// add-movie (post request)
// we perform validation for images and genres all by ourself (not in the DB schema)
// that is why there is so much mess here!
router.post('/add-movie', (req, res) => {
    let photosArray = [];
    if (req.files !== null) { // if at least one type of the images exist (either photos or poster)
        let photoObject = req.files.movie_photos;
        let posterObject = req.files.movie_poster;
        
        if (typeof(photoObject) == "undefined" || typeof(posterObject) == "undefined") {
            res.redirect('back');
        }

        else if (photoObject && Object.keys(photoObject).length === 9) {
            posterObject.mv('./public/admin/img/posters/' + posterObject.name); // this moves the poster file to the server
            
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
        else if (photoObject && Object.keys(photoObject).length > 0) {
            console.log('MORE THAN 1 BUT NOT 9 IMAGES UPLOADED');
            for (let i = 0; i < Object.keys(photoObject).length; i++) {
                let photoObject = req.files.movie_photos[i];
                photoObject.mv('./public/admin/img/photos/movie-photos/' + photoObject.name); // individually moving all the photo files to the server
                photosArray.push(photoObject.name);
            }
        }
    }
    else if (req.files === null) { // if no image exists at all (neither photos nor the poster)
        console.log('No image uploaded at all');
        res.redirect('back');
    }
    
    let incomingData = req.body;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    let dataToSave = new Movies({
        name: incomingData.movie_name,
        description: incomingData.movie_desc, 
        runtime: incomingData.runtime, 
        videoQuality: incomingData.movie_quality, 
        yearReleased: incomingData.year, 
        videoLink: incomingData.youtube_video.replace('/watch?v=', '/embed/'),
        genre: incomingData.movie_genres,
        visibility: 1, 
        rating: 0.0,
        dateCreated: today, 
        totalReviews: 0, 
        author: incomingData.author, 
        poster: req.files.movie_poster.name, 
        photos: photosArray
    });

    if (incomingData.movie_genres) {
        dataToSave.save()
        .then( () => {
            res.redirect('/admin/movies/view-movies'); // Here, they will be able to see their recently added movie. You can also render and send a success message
        }).catch( (error) => {
            res.render('admin/add-movie', { error: 
                `Sorry! We could not add the movie. 
                It may be possible that you did not fill out some field. 
                Please make sure that you fill in all the fields. ${ error }`,
            });
        });
    }
    else {
        res.render('admin/add-movie', { error: 
            `Sorry! We could not add the movie. 
            It may be possible that you did not fill out some field. 
            Please make sure that you fill in all the fields`
        });
    }
});

// edit-movie (get)
router.get('/edit-movie/:id', (req, res) => {
    let movieID = req.params.id;
    console.log(movieID);

    // fetching the movie by ID from the DB
    Movies.findOne({_id: ObjectID(movieID)}).lean()
    .then( (data) => {
        console.log(data);
        res.render('admin/edit-movie', {
            movie: data
        });
    })
    .catch( (error) => res.status(404).send('Failed to edit the movie', error));
});


// edit-movie (post)
router.post('/edit-movie/:id', (req, res) => {
    let incomingData = req.body;
    let id = req.params.id; 
    
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    let dataToUpdate = {
        name: incomingData.movie_name,
        description: incomingData.movie_desc, 
        runtime: incomingData.runtime, 
        videoQuality: incomingData.movie_quality, 
        yearReleased: incomingData.year, 
        videoLink: incomingData.youtube_video.replace('/watch?v=', '/embed/'),
        genre: incomingData.movie_genres,
        visibility: 1, 
        rating: 0.0,
        dateCreated: today, 
        totalReviews: 0, 
        author: incomingData.author
    };
    Movies.findOneAndUpdate( {_id: ObjectID(id) }, dataToUpdate).lean()
    .then( () => {
        res.redirect('/admin/movies/view-movies');
    })
    .catch( (error) => res.status(404).send('Failed to Update the Movie', error));
});


// delete-movie (get)
router.get('/delete-movie/:id', (req, res) => {
    let movieID = req.params.id;
    
    Movies.findOneAndDelete( {_id: ObjectID(movieID)} ).lean()
    .then( () => res.redirect('back')) // used for refreshing the page
    .catch( (error) => res.status(404).send('Failed to delete the movie', error));
});

module.exports = router;