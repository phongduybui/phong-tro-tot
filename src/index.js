const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

const db = require('./config/db');
const New = require('./app/models/New');

//Connect to DB
db.connect();


//Config static file (img, css...)
app.use(express.static(path.join(__dirname, 'public')));
app.use("/src/app", express.static(__dirname + '/app'));
app.use("/src/public", express.static(__dirname + '/public'));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// HTTP logger
// app.use(morgan('combined'));

//Template engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//Config views folders
app.set('views', path.join(__dirname, 'resources', 'views')); //'resources/views'

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/news', function (req, res) {
    res.render('news');
});

// app.post('/search', (req, res) => {
//     console.log(req.body);
//     res.send('');
// });

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


