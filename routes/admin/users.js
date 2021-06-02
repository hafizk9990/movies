const express = require('express');
const router = express.Router();
const Users = require('../../models/Users');
const mongoose = require('mongoose');
const { ObjectID } = require('bson');


// overwriting default layout of app.js (which goes to home)
router.all('/*', (req, res, next) => { // select everything that comes after this route (localhost:64000/admin/movies)
    req.app.locals.layout = 'index-admin'; // and overwrite the default layout for all these routes to index-admin from views/layouts folder
    next();
});


// view-users (get request)
router.get('/', (req, res) => {
    Users.find( {} ).lean()
    .then( (allUsers) => {
        res.render('admin/view-users', { users: allUsers });
    })
    .catch( (error) => {
        res.status(400).send('Someting went wrong', error);
    });
});


// view-users/delete/some-user
// doing it a little different way
// this way of doing deletion is preferred
// you just have to:
// 1) download method-override
// 2) set it up in middleware using app.use
// 3) add ?_mehod=DELETE OR ?_methode=PUT in href or form action = ""
// 4 add router.use() as above
router.delete('/delete/:id', (req, res) => {
    let userID = req.params.id;

    Users.findOneAndDelete( {_id: ObjectID(userID)} )
    .then( (deletedUser) => {
        req.flash('userDeletionSuccessful', `User ${ deletedUser.email } has been deleted`);
        res.redirect('back');
    })
    .catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});


// updating user type (make admin)
router.put('/update-admin/:id', (req, res) => {
    let userID = req.params.id;
    
    Users.findOneAndUpdate( {_id: ObjectID(userID)}, { userType: 'Admin' } )
    .then( (updatedUser) => {
        req.flash('userMadeAdmin', `User ${ updatedUser.email } has been given admininstrator privileges`);
        res.redirect('back');
    })
    .catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});


// updating user type (make non-admin)
router.put('/update-non-admin/:id', (req, res) => {
    let userID = req.params.id;
    
    Users.findOneAndUpdate( {_id: ObjectID(userID)}, { userType: 'Non-Admin' } )
    .then( (updatedUser) => {
        req.flash('userMadeNonAdmin', `User ${ updatedUser.email } has been made an ordinary user`);
        res.redirect('back');
    })
    .catch( (error) => {
        res.render('errors/server', { exactError: error });
    });
});

module.exports = router;