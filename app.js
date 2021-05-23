const express = require('express');
const handlebarsEngine = require('express-handlebars');
const Handlebars = require('handlebars');
require('./mongodb/db');
const bp = require('body-parser'); // this boy is deprecated. Now, we use express.json() and express.urlencoded( {} )
const { select, select2 } = require('./helper/handlebars-helpers');
const uploadFiles = require('express-fileupload');

// creating express app and http server through that
const app = express();
app.listen(64000, () => console.log('NodeJS server running now'));

// setting up our json body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// setting up our templating engine and default layout to home
app.set('view engine', 'handlebars'); // tell NodeJS what is your templating engine (express-handlebars)
app.engine('handlebars', handlebarsEngine( {defaultLayout: 'index-home', helpers: { select: select, select2: select2 }} )); // Tell it what is the default file from the layouts (EXHBR peeks here by default) folder (views/layouts/index-home)


// setting up file uploading functionality
app.use(uploadFiles({
    useTempFiles: true,
}));


// setting up all our routes
app.use('/', require('./routes/home/main'));
app.use('/admin', require('./routes/admin/main'));
app.use('/admin/movies', require('./routes/admin/movies'));


// serving template files for home
app.use('/css', express.static('./public/home/css'));
app.use('/fonts', express.static('./public/home/fonts'));
app.use('/icon', express.static('./public/home/icon'));
app.use('/img', express.static('./public/home/img'));
app.use('/js', express.static('./public/home/js'));


// serving template files for the admin
app.use('/css', express.static('./public/admin/css'));
app.use('/fonts', express.static('./public/admin/fonts'));
app.use('/img', express.static('./public/admin/img'));
app.use('/js', express.static('./public/admin/js'));
app.use('/scss', express.static('./public/admin/scss'));
