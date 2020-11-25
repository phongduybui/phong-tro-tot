const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

//Database
const db = require('./config/db');
const New = require('./app/models/New');
const { mutipleMongooseToObject } = require('./util/mongoose');
const { mongooseToObject } = require('./util/mongoose');


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
    extname: '.hbs',
    helpers: {
        section: function(name, options){ 
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this); 
            return null;
        } 
    }    
}));
app.set('view engine', 'hbs');


//Config views folders
app.set('views', path.join(__dirname, 'resources', 'views')); //'resources/views'


app.get('/', function (req, res, next) {
    New.find({})
        .then(news => {
            res.render('home', {
                news: mutipleMongooseToObject(news),
                isHome: true
            });
        })
        .catch(next);
});

app.get('/news/post', (req, res, next) => {
    res.render('news/post');
});

app.get('/news/:slug', (req, res, next) => {
    New.findOne({ slug: req.params.slug })
        .then(oneNew => {
            res.render('news/show', {
                oneNew : mongooseToObject(oneNew),
                isNewsPage: true
            });
        })
        .catch(next);
});


app.get('/features/top-up', function (req, res) {
    res.render('features/top-up');
});



// app.post('/search', (req, res) => {
//     console.log(req.body);
//     res.send('');
// });

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


