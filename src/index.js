const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;


var cookieParser = require('cookie-parser')
const session = require('express-session');
app.use(cookieParser())
app.use(session({
    cookie: {maxAge: null},
    secret: 'phong',
    resave: true,
    saveUninitialized: true
}))

//flash message middleware
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})


//Database
const db = require('./config/db');
const New = require('./app/models/New');
const User = require('./app/models/User.js');
const { checkLogin, checkTenant, checkHost, checkAdmin } = require('./app/middleware/auth');

const accessTokenSecret = 'phong'; 
//middleware auth


const { mutipleMongooseToObject } = require('./util/mongoose');
const { mongooseToObject } = require('./util/mongoose');


//method override
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

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
        },
        sum: function(a, b){
            return a + b;
        },
        ifCond: function checkCondition(v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        forIf: function(array, value, options){
            let check = false;
            for(let i=0; i<array.length; i++){
                if(array[i] == value){
                    check = true;
                }
            }
            return check ? options.fn(this) : options.inverse(this);
        },
        formatDate: function(date){
            return new Date().toLocaleString();
           
        }
    }    
}));
app.set('view engine', 'hbs');


//Config views folders
app.set('views', path.join(__dirname, 'resources', 'views')); //'resources/views'



app.get('/', checkLogin,function (req, res, next) {
    let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 

    New
        .find() // find tất cả các sản phẩm 
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, news) => {
        New.countDocuments((err, count) => { // đếm để tính xem có bao nhiêu trang
            if (err) return next(err);
                res.render('home', {
                    news: mutipleMongooseToObject(news), // sản phẩm trên một page
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage), // tổng số các page
                    isHome: true,
                    userData: mongooseToObject(req.data)
                });
            });
        });



    // New.find({})
    //     .then(news => {
    //         res.render('home', {
    //             news: mutipleMongooseToObject(news),
    //             isHome: true
    //         });
    //     })
    //     .catch(next);
});
app.get('/hot-news/:page', function (req, res, next) {
    let perPage = 6; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 

    New
        .find() // find tất cả các sản phẩm 
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, news) => {
        New.countDocuments((err, count) => { // đếm để tính xem có bao nhiêu trang
            if (err) return next(err);
                res.render('home', {
                    news: mutipleMongooseToObject(news), // sản phẩm trên một page
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage), // tổng số các page
                    isHome: true,
                });
            });
        });
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
        // alert("Successful!");
        res.redirect('/news/post');
    });
    
});



app.get('/news/:id/edit', (req, res, next) => {
    New.findById(req.params.id)
        .then(news => res.render('news/edit', {
            new: mongooseToObject(news)
        }))
        .catch(next)
})

app.put('/news/:id', (req, res, next) => {
    const data = req.body;
    New.updateOne({ _id: req.params.id }, {
        kind: data.kind,
        title: data.title,
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
        features: data.features,
        "overview.area": data.area,
        "overview.bedroom": data.bedroom,
        "overview.bathroom": data.bathroom,
        "overview.floor": data.floor,
        "overview.yearBuilt": data.yearBuilt,
        "host.nameHost": data.nameHost,
        "host.phoneNumber": data.phoneNumber,
        "host.mailHost": data.mailHost,
    })
        .then(() => {
            req.session.message = {
                type: 'success',
                intro: 'Successfully!',
                message: 'News has been updated.'
            }
            res.redirect('/me/news-management')
        })
        .catch(next)
})

app.delete('/news/:id', (req, res, next) => {
    New.deleteOne({ _id: req.params.id })
        .then(() => {
            req.session.message = {
                type: 'success',
                intro: 'Deleted successfully',
                message: '!'
            }
            res.redirect('back')
        })
        .catch(next)
})

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

app.get('/users', (req, res, next) => {
    res.render('authen/access', {layout: false});
})


//Login user has been register
app.post('/users/login', async(req, res, next) => {

    const { email, password } = req.body;
    // Filter user from the users array by username and password
    User.findOne({ email: email, password: password })
        .then(data => {
            if(data){
                var token = jwt.sign({ _id: data._id }, accessTokenSecret)
                res.cookie('token', token, {maxAge: 1000 * 60 * 300})
                res.redirect('/')
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Login failed!',
                    message: 'Email or password incorrect.'
                }
                res.redirect('/users')
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json('Loi server!');
        })   
});

app.get('/users/logout', (req, res, next) => {
    res.clearCookie("token").redirect('/');
    
})

app.get('/users/me', checkLogin, checkAdmin, (req, res, next) => {
    res.json('welcome')
})

//Route register user
app.post('/users', async (req, res) => {
    const data = req.body;
    if(data.password !== data.confirm){
        req.session.message = {
            type: 'danger',
            intro: 'Passwords do not match!',
            message: 'Please make sure to insert the same password.'
        }
        res.redirect('/users')
    }
    else {
        req.session.message = {
            type: 'success',
            intro: 'You are now registerd!',
            message: 'Please login.'
        }
        try {
            const user = new User(req.body)
            await user.save()

            res.redirect('/users')
        } catch (error) {
            console.log(error);
            res.redirect('/users');
        }
    }
    
})








app.get('/me/deposit-history', checkLogin, function(req, res) {
    res.render('me/deposit-history', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data)
    });
});

app.get('/me/payment-history', checkLogin, function(req, res) {
    res.render('me/payment-history', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data)
    });
});

app.get('/me/news-management', checkLogin, function(req, res, next) {
    New.find({})
        .then(news => {
            res.render('me/news-management', {
                news: mutipleMongooseToObject(news),
                layout: 'dashboard.hbs',
                userData: mongooseToObject(req.data)
            });
        })
        .catch(next)
    
});

app.get('/me', checkLogin,  function(req, res) {
    res.render('me/pages-profile', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data)
    });
});


app.get('/dashboard/blank', function(req, res) {
    res.render('admin/blank', {layout: 'dashboard.hbs'});
});




//Admin
app.get('/admin/dashboard', checkLogin, checkAdmin, function(req, res) {
    res.render('admin/dashboard-content', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data)
    });
});

app.get('/admin/account-manage', checkLogin, checkAdmin, function(req, res) {
    User.find({})
        .then(users => {
            res.render('admin/account-manage', {
                layout: 'dashboard.hbs',
                users: mutipleMongooseToObject(users),
                userData: mongooseToObject(req.data)
            });
        })
});

app.get('/admin/account-manage/:id/edit', checkLogin, checkAdmin, function(req, res, next) {
    let userId = req.params.id;
    User.findOne({ _id: userId })
        .then(user => res.render('admin/edit-account' , {
            layout: 'dashboard',
            user: mongooseToObject(user)
        }))
        .catch(next)
    
});

app.put('/admin/account-manage/:id', checkLogin, checkAdmin, function(req, res, next) {
   const data = req.body;
   User.updateOne({_id: req.params.id}, data)
        .then(() => {
            req.session.message = {
                type: 'success',
                intro: 'Successfully',
                message: 'Account information has been updated!'
            }
            res.redirect('/admin/account-manage')
        })
        .catch(next)
    
});

app.put('/me', checkLogin, function(req, res, next) {
    const data = req.body;
    User.updateOne({_id: req.data.id}, data)
         .then(() => {
            req.session.message = {
                type: 'success',
                intro: 'Successful!',
                message: 'Personal information has been updated.'
            }
            res.redirect('/me')
         })
         .catch(next)
     
 });

app.delete('/admin/user/:id', checkLogin, checkAdmin, (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => {
            req.session.message = {
                type: 'success',
                intro: 'Deleted successfully',
                message: '!'
            }
            res.redirect('back')
        })
        .catch(next)
})



app.get('/admin/account-manage/add-user', (req, res, next) => {
    res.render('admin/add-user', {
        layout: 'dashboard'
    });
});


app.post('/admin/account-manage/store', (req, res, next) => {

    const data = req.body;
    const user = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
    })

    user.save(function (err) {
        if (err){
            res.send(err);
        }
        else {
            req.session.message = {
                type: 'success',
                intro: 'Account added successfully',
                message: '!'
            }
            res.redirect('/admin/account-manage');
        }
    });
    
});



app.get('/forgot', (req, res, next) => {
    res.render('authen/forgot', { layout: false })
})


//Error handling page
app.get('/error/403', function(req, res) {
    res.render('error/403-forbidden', {layout: false});
});
app.get('/error/404', function(req, res) {
    res.render('error/error-404', {layout: false});
});



app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


