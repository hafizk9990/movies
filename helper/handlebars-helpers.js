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
    forOtherImagesofViewMovies: function (photosArray, options) {
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
    },
    forEditMovies: function (photosArray, options) {
        // Here, instead of <br>, I am adding a newline character "\n" because textarea does not
        // recognize <br>
        
        if (photosArray) {
            let toReturn = ``;
            for (let i = 0; i < photosArray.length; i++) {
                toReturn +=i + 1 + ')  ' + photosArray[i] + '\n'
            }
            return (toReturn);
        }
        else {
            return 'No Image Found';
        }
    },
    genreForMovieDetails: function (genreArray, options) {
        // for dynamically displaying genre of movies on single movie click page
        
        if (genreArray) {
            let toReturn = ``;
            for (let i = 0; i < genreArray.length; i++) {
                toReturn += genreArray[i] + ' | '
            }
            return (toReturn.slice(0, -2));
        }
        else {
            return 'No Genres Added Yet';
        }
    },
    moviePhotoRequest: function (photoName, options) {
        // for adding request for all the photos associated with the movie
        // other than the poster itself

        return(`
        <figure class="col-12 col-sm-6 col-xl-4" itemprop="associatedMedia" itemscope>
            <a itemprop="contentUrl" data-size="1920x1280">
                <img src="/photos/${ photoName }" itemprop="thumbnail" alt="Image description" />
            </a>
        <figcaption itemprop="caption description">Some image caption 1</figcaption>
        </figure>`);
    }, 
    countPhotos: function(array) {
        return array.length;
    }
}
