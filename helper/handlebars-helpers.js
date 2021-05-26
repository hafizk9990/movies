module.exports = {
    select: function(genreName, options) {
        // this is for the genreArray's each genre that comes in while we are editing the movie

        return(`<option selected value=${ genreName }> ${ genreName } </option>`)
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
            <figcaption itemprop="caption description"> Additional Movie Photo </figcaption>
        </figure>`);
    }, 
    countPhotos: function(array) {
        return array.length;
    }, 
    visibilityStatus: function(input, options) {
        return input == 'true'? 'Yes': 'No';
    }
}
