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


//Slug Generator
const toSlug = require('./app/slug-generator');


//Connect to DB
db.connect();


//File Upload
const fileUpload = require('express-fileupload');
app.use(fileUpload());




//Config static file (img, css...)
app.use(express.static(path.join(__dirname, 'public')));
app.use("/src/app", express.static(__dirname + '/app'));
app.use("/src/public", express.static(__dirname + '/public'));
app.use("/src/nice-admin", express.static(__dirname + '/nice-admin'));


//Middleware to get data from req.body (gui tu form)
app.use(express.urlencoded({
    extended: true
}));
//Middleware to get,post using axios/fetch/XMLHttpRequest... (gui dung js)
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
            .catch(next);
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
            .catch(next);
    }
    
})



app.get('/news/post', (req, res, next) => {
    res.render('news/post');
});




app.post('/news/store', (req, res, next) => {
    let imgArray = [];
    if(req.files){

        const file = req.files.image;
        console.log(file)
        
        if(Array.isArray(file)){
            for(let i = 0 ; i < file.length; i++){
                imgArray[i] = '/src/public/img/upload/'+file[i].name;
                file[i].mv(__dirname + '/public/img/upload/'+file[i].name, function (err){
                    if(err){
                        res.send(err);
                    }
                })
            }
        }
        else {
            file.mv(__dirname + '/public/img/upload/'+file.name);
            imgArray[0] = '/src/public/img/upload/'+file.name;
        }
        
        
    }
    console.log(imgArray)
    const data = req.body;
    const news = new New({
        motelId: '_' + Math.random().toString(36).substr(2, 5),
        img: imgArray,
        kind: data.kind,
        title: data.title,
        slug: toSlug(data.title),
        gender: data.gender,
        priceNumber: data.price,
        price: data.price/1000000 + ' triệu',
        idCity: data.idCity,
        idDis: data.idDis,
        idWard: data.idWard,
        street: data.street,
        address: data.address,
        location: data.location,
        description: data.description,
        kindOfNews: data.kindOfNews,
        features: data.features,
        "overview.area": data.area,
        "overview.bedroom": data.bedroom,
        "overview.bathroom": data.bathroom,
        "overview.floor": data.floor,
        "overview.yearBuilt": data.yearBuilt,
        "host.nameHost": data.nameHost,
        "host.phoneNumber": data.phoneNumber,
        "host.mailHost": data.mailHost,
        "host.imgHost": '/src/public/img/user7.jpg'
    });


    news.save(function (err) {
        if (err){
            res.send(err);
        }
        alert("Successful!");
        res.redirect('/news/post');
    });
    
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




app.get('/dashboard', function(req, res) {
    res.render('admin/pages-profile', {layout: 'dashboard.hbs'});
});

app.get('/dashboard/deposit-history', function(req, res) {
    res.render('admin/deposit-history', {layout: 'dashboard.hbs'});
});

app.get('/dashboard/payment-history', function(req, res) {
    res.render('admin/payment-history', {layout: 'dashboard.hbs'});
});

app.get('/dashboard/news-management', function(req, res) {
    res.render('admin/news-management', {layout: 'dashboard.hbs'});
});



app.get('/dashboard/blank', function(req, res) {
    res.render('admin/blank', {layout: 'dashboard.hbs'});
});
app.get('/error/404', function(req, res) {
    res.render('admin/error-404', {layout: false});
});


//Admin
app.get('/admin/dashboard', function(req, res) {
    res.render('admin/dashboard-content', {layout: 'dashboard.hbs'});
});

app.get('/admin/account-manage', function(req, res) {
    res.render('admin/account-manage', {layout: 'dashboard.hbs'});
});





app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


