module.exports = {
    select: function(genreArray, options) {
        // this is for the genreArray that comes in while we are editing the movie
        // sadly, i don't know why, it works but only for the first genre

        if (genreArray.length > 1) {
            for (let i = 0; i < genreArray.length; i++) {
                return options.fn(this).replace(new RegExp(' value=\"'+ genreArray[i] + '\"'), '$&selected="selected"');
            }
        }
        else if (genreArray.length == 1) {
            return options.fn(this).replace(new RegExp(' value=\"'+ genreArray + '\"'), '$&selected="selected"');
        }
    },
    select2: function(selected, options) {
        // this is for videoQuality options while we are editing the movies
        
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },
    select3: function (photosArray, options) {
        // this function is the helper for "other images" field in /admin/movie/view-movies
        
        if (photosArray) {
            let toReturn = ``;
            for (let i = 0; i < photosArray.length; i++) {
                toReturn += i + 1 + ')  ' + photosArray[i] + ' <br>'
            }
            return (toReturn);
        }
        else {
            return 'No Image Found';
        }
    }
}
