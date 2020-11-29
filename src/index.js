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
app.use("/src/nice-admin", express.static(__dirname + '/nice-admin'));

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
        },
        numberWithCommas: function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }    
}));
app.set('view engine', 'hbs');


//Config views folders
app.set('views', path.join(__dirname, 'resources', 'views')); //'resources/views'


app.get('/', function (req, res, next) {
    // console.log(req.query)
    New.find({})
        .then(news => {
            res.render('home', {
                news: mutipleMongooseToObject(news),
                isHome: true
            });
        })
        .catch(next);
});

app.get('/search-result', function(req, res, next){
    if(!req.query.title){
        var kindRegex = new RegExp(req.query.kind, 'i');
        var provinceRegex = new RegExp(req.query.province, 'i');
        var districtRegex = new RegExp(req.query.district, 'i');
        var wardRegex = new RegExp(req.query.ward, 'i');
        var priceMin =  req.query.price - 0;
        var priceMax = (priceMin === 6000000) ? 100000000 : priceMin + 1000000;
        
        var areaMin =  req.query.areaMin - 0;
        var areaMax =  req.query.areaMax - 0;
        New.find({ kind: kindRegex, 
            idCity: provinceRegex,
            idDis: districtRegex,
            idWard: wardRegex, 
            priceNumber: { $gte: priceMin, $lte: priceMax },
            "overview.area": { $gte: areaMin, $lte: areaMax },
        })
            .then(result => {
                res.render('search-result', {
                    results: mutipleMongooseToObject(result)
                })
        })
    }
    else {
        var titleRegex = new RegExp(req.query.title, 'i');
        New.find(
            { title: titleRegex })
            .then(result => {
                res.render('search-result', {
                    results: mutipleMongooseToObject(result)
                })
        })
    }
    
})



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

app.get('/me/manage-user', function(req, res){
    res.render('me/manage-user-info');
});

app.get('/dashboard', function(req, res) {
    res.render('news', {layout: 'dashboard.hbs'});
});

app.get('/dashboard/pages-profile', function(req, res) {
    res.render('admin/pages-profile', {layout: 'dashboard.hbs'});
});




app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


