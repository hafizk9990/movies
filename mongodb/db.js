const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/moviesProject')
    .then( (success) => {
        console.log('MongoDB connection established successfully');
    })
    .catch( (error) => {
        console.log('Failed to connect with MongoDB', error);
    });
