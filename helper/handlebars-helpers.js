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
            return 'No Genres Added';
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
    dateHelper: function (date, options) {
        let dateMonthYear = date.split('.');
        let monthName = '';
        dateMonthYear[1] == 1? monthName = 'January':
        dateMonthYear[1] == 2? monthName = 'February':
        dateMonthYear[1] == 3? monthName = 'March':
        dateMonthYear[1] == 4? monthName = 'April':
        dateMonthYear[1] == 5? monthName = 'May':
        dateMonthYear[1] == 6? monthName = 'June':
        dateMonthYear[1] == 7? monthName = 'July':
        dateMonthYear[1] == 8? monthName = 'August':
        dateMonthYear[1] == 9? monthName = 'September':
        dateMonthYear[1] == 10? monthName = 'October':
        dateMonthYear[1] == 11? monthName = 'November':
        dateMonthYear[1] == 12? monthName = 'December':
        'foo'

        return(`${ monthName } ${ dateMonthYear[0] }, ${ dateMonthYear[2] }`);
    },
    movieRating: function(rating, totalRatings, options) {
        if (parseFloat(rating) > 0) {
            return( Math.round(parseFloat(rating / totalRatings) * 10) / 10 ); // rounding off to 1 DP
        }
        else {
            return 'Not Rated';
        }
    },
    createFullName: function(object, options) {
        console.log(object);
        return(`${ object.firstName } ${ object.lastName } | ${ object.email }`);
    },
    generateHomeMoviesDynamically: function(tabNumber, genreObject) {
        let toReturn = `<div class="tab-pane fade" id="tab-${tabNumber+2}" role="tabpanel" aria-labelledby="${tabNumber+2}-tab">
        <div class="row">`;
        
        if (global.allMovies) {
            for (let i = 0; i < global.allMovies.length; i++) {
                if (global.allMovies[i].genre.includes(genreObject.name)) {
                    toReturn +=
                    `<div class="col-6 col-sm-4 col-lg-3 col-xl-2">
                        <div class="card">
                            <div class="card__cover">
                                <img src="/posters/${ global.allMovies[i].poster }" alt="">
                                <a href="/home/movies/${ global.allMovies[i]._id }" class="card__play">
                                    <i class="icon ion-ios-play"></i>
                                </a>
                            </div>
                            <div class="card__content">
                                <h3 class="card__title"><a href="/home/movies/${ global.allMovies[i]._id }"> ${ global.allMovies[i].name } </a></h3>
                                <span class="card__rate"><i class="icon ion-ios-star"></i> ${ Math.round(global.allMovies[i].rating / global.allMovies[i].totalNumberOfRatings * 10) / 10 } </span>
                            </div>
                        </div>
                    </div>`
                }
            }
        }
        toReturn += `</div></div>`
        return(toReturn);
    },
    generateHomeLatestReviews: (carouselData) => {
        let toReturn = ``;
        let count = 0;
        for (let i = carouselData.length - 1; ; i--) {
            count++;
            if (count == 7 || !carouselData[i])
                break;
            toReturn +=
            `<!-- card -->
            <div class="col-6 col-sm-12 col-lg-6">
                <div class="card card--list">
                    <div class="row">
                        <div class="col-12 col-sm-4">
                            <div class="card__cover">
                                <img src="/posters/${ carouselData[i].poster }" alt="">
                                <a href="/home/movies/${ carouselData[i]._id }" class="card__play">
                                    <i class="icon ion-ios-play"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 col-sm-8">
                            <div class="card__content">
                                <h3 class="card__title"><a href="/home/movies/${ carouselData[i]._id }"> ${ carouselData[i].name } </a></h3>
                                <span class="card__category">
                                    <a> ${ carouselData[i].genre } </a>
                                </span>

                                <div class="card__wrap">
                                    <span class="card__rate"><i class="icon ion-ios-star"></i> ${ Math.round(carouselData[i].rating / carouselData[i].totalNumberOfRatings * 10) / 10 } </span>

                                    <ul class="card__list">
                                        <li> ${ carouselData[i].videoQuality } </li>
                                        <li> Available </li>
                                    </ul>
                                </div>
                                <div class="card__description">
                                    <p>
                                        ${ carouselData[i].description }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        }
        return(toReturn);
    }, 
    generateAgeRandomly: () => {
        return Math.floor(Math.random() * (16 - 12 + 1) + 12)
    }
}
