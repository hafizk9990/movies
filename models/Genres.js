const mongoose = require('mongoose');

let genresSchema = {
    name: {
        type: String, 
        required: true
    }
}

const genresModel = mongoose.model('genres', genresSchema);
module.exports = genresModel;
