const express = require('express');
const app = express();

// serving template files for home
app.use('/css', express.static('./public/home/css'));
app.use('/fonts', express.static('./public/home/fonts'));
app.use('/icon', express.static('./public/home/icon'));
app.use('/img', express.static('./public/home/img'));
app.use('/js', express.static('./public/home/js'));
