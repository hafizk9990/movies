const Movies = require("../models/Movies");

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
                toReturn += genreArray[i] + ' | ';
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
        return (input == 1? 'Yes': 'No');
    }, 
    generateHomeGenreNamesDynamicallyforNonMobile: function(eachGenreObject, arrayIndex, option) {
        return(`
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#tab-${ arrayIndex + 2 }" role="tab" aria-controls="tab-${ arrayIndex + 2 }" aria-selected="false"> ${ eachGenreObject.name } </a>
            </li>
        `);
    },
    generateHomeGenreNamesDynamicallyforMobile: function(eachGenreObject, arrayIndex, option) {
        return(`
            <li class="nav-item">
                <a class="nav-link" id="2-tab" data-toggle="tab" href="#tab-${ arrayIndex + 2 }" role="tab" aria-controls="tab-${ arrayIndex + 2 }" aria-selected="false"> ${ eachGenreObject.name } </a>
            </li>
        `);
    },
    generateHomeMoviesDynamically: function(tabNumber, genreObject, options) {
        return(
            `<div class="tab-pane fade" id="tab-${tabNumber+2}" role="tabpanel" aria-labelledby="${tabNumber+2}-tab">
                <div class="row">
                    <!-- card -->
                    <div class="col-6 col-sm-4 col-lg-3 col-xl-2">
                        <div class="card">
                            <div class="card__cover">
                                <img src="img/covers/cover.jpg" alt="">
                                <a href="#" class="card__play">
                                    <i class="icon ion-ios-play"></i>
                                </a>
                            </div>
                            <div class="card__content">
                                <h3 class="card__title"><a href="#"> You dream, I dream, we dream </a></h3>
                                <span class="card__category">
                                    <a href="#">Action</a>
                                    <a href="#">Triler</a>
                                </span>
                                <span class="card__rate"><i class="icon ion-ios-star"></i>8.4</span>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->



                    <!-- card -->
                    <div class="col-6 col-sm-4 col-lg-3 col-xl-2">
                        <div class="card">
                            <div class="card__cover">
                                <img src="img/covers/cover.jpg" alt="">
                                <a href="#" class="card__play">
                                    <i class="icon ion-ios-play"></i>
                                </a>
                            </div>
                            <div class="card__content">
                                <h3 class="card__title"><a href="#"> You dream, I dream, We dream </a></h3>
                                <span class="card__category">
                                    <a href="#">Action</a>
                                    <a href="#">Triler</a>
                                </span>
                                <span class="card__rate"><i class="icon ion-ios-star"></i>8.4</span>
                            </div>
                        </div>
                    </div>
                    <!-- end card -->


                </div>
            </div>`
        );
    }
}
