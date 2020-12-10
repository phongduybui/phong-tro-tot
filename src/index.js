const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var flash = require('connect-flash');
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
const Manage = require('./app/models/Manage');
const Tenant = require('./app/models/Tenant');
const { getInfo, getInfoLogin, checkLogin, checkTenant, checkHost, checkAdmin } = require('./app/middleware/auth');

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
app.use(flash());



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
           
        },
        multiply: (a, b) => a * b,
        summ: (a, b, c) => a + b + c,
        minus: (a,b) => a-b,
    }    
}));
app.set('view engine', 'hbs');


//Config views folders
app.set('views', path.join(__dirname, 'resources', 'views')); //'resources/views'


app.get('/manage/room_manage/function/check-camera', (req, res, next)=>{
    res.render('tenants/camera');
})

app.get('/manage/price', checkLogin, (req, res)=>{
    res.render('price', {
        userData: mongooseToObject(req.data)
    });
})

app.get('/manage/room_manage/function/invoice/:id/input', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>res.render('tenants/input', {
            tenant: mongooseToObject(tenant)
        }))

        .catch(next);
})

app.put('/manage/room_manage/function/invoice/:id', (req, res, next)=>{
    Tenant.updateOne({_id: req.params.id}, req.body)
        .then(()=>{
            res.redirect('/manage/room_manage/function/invoice');
        })

        .catch(next);
})


app.get('/manage/room_manage/function/invoice/:id/see-invoice/:email', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>{
            req.flash('tenant1', tenant)
            res.render('tenants/see-invoice', {
            tenant: mongooseToObject(tenant)
        })})
        .catch(next);


        // console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'phongtrotot.hotro@gmail.com',
                pass: 'phongtrotot'
            }
        });

        var mailOptions = {
            from: 'phongtrotot.hotro@gmail.com',
            to: req.params.email,
            subject: 'PTT - Invoice ',
            html: `
                <div class="card" style="width: 900px; border: 1px solid rgb(112, 111, 111); height:600px;"> <div class="card-header" style="width:98%; height: 5%; border-bottom: 1px solid rgb(112, 111, 111); padding-top: 1em; padding-left: 1em; background-color: rgb(241, 241, 241);"> Invoice <strong>--/--/--</strong> <span style="float: right; padding-right: 1em;"> <strong >Status:</strong> Pending</span> </div><div class="card-body" style="margin-left: 2em;"> <div class="row mb-4"> <div class="col-sm-6" style="width: 50%;float:left;"> <h4 class="mb-3">From:</h4> <strong>Webz Poland</strong> <p>Madalinskiego 8 <br>71-101 Szczecin, Poland <br>Email: info@webz.com.pl <br>Phone: +48 444 666 3333</p></div><div class="col-sm-6" style="width:50%; float:left;"> <h4 class="mb-3">To:</h4> <strong>Webz Poland</strong> <p>Madalinskiego 8 <br>71-101 Szczecin, Poland <br>Email: info@webz.com.pl <br>Phone: +48 444 666 3333</p></div></div><div class="table-responsive-sm"> <table class="table table-striped" style="border-top: 1px solid black;width: 820px; border-bottom: 1px solid black;"> <thead> <tr> <th class="center" style="border-bottom: 1px solid black;">#</th> <th style="border-bottom: 1px solid black;">Item</th> <th style="border-bottom: 1px solid black;">Month</th> <th class="right" style="border-bottom: 1px solid black;">Unit Cost</th> <th class="center" style="border-bottom: 1px solid black;">Amount</th> <th class="right" style="border-bottom: 1px solid black;">Total</th> </tr></thead> <tbody> <tr> <td class="center">1</td><td class="left strong">-</td><td class="left">-</td><td class="right">-</td><td class="center">-</td><td class="right">-</td></tr><tr> <td class="center">2</td><td class="left">-</td><td class="left">-</td><td class="right">-</td><td class="center">-</td><td class="right">-</td></tr><tr> <td class="center">3</td><td class="left">-</td><td class="left">-</td><td class="right">-</td><td class="center">-</td><td class="right">-</td></tr><tr> <td class="center">4</td><td class="left">-</td><td class="left">-</td><td class="right">-</td><td class="center">-</td><td class="right">-</td></tr></tbody> </table> </div><div class="row"> <div class="col-lg-4 col-sm-5"> </div><div class="col-lg-4 col-sm-5 ml-auto"> <table class="table table-clear" style="float: right;margin-right: 10em;"> <tbody> <tr> <td class="left"> <strong>Subtotal</strong> </td><td class="right">-</td></tr><tr> <td class="left"> <strong>Discount (20%)</strong> </td><td class="right">-</td></tr><tr> <td class="left"> <strong>VAT (10%)</strong> </td><td class="right">-</td></tr><tr> <td class="left"> <strong>Total</strong> </td><td class="right"> <strong>-</strong> </td></tr></tbody> </table> </div></div></div></div>
            `,
            
        };

        transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        req.flash('email', req.body.email)
                        req.flash('verifyCode', verifyCode)
                        res.redirect('back')
                    }
                });
        
})

app.get('/manage/room_manage/function/invoice/:id/see-invoice', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>res.render('tenants/see-invoice', {
            tenant: mongooseToObject(tenant)
        }))
        .catch(next);
})

app.get('/manage/room_manage/function/invoice', (req, res, next)=>{
    
    Tenant.find({})
        .then(tenant=>{
            res.render('tenants/invoice', {
                tenant: mutipleMongooseToObject(tenant)
            });
        })
        .catch(next);

    // res.render('tenants/invoice');
})

app.get('/manage/room_manage/function/declare', (req, res, next)=>{
    Tenant.find({})
        .then(tenant=>{
            res.render('tenants/declare', {
                tenant: mutipleMongooseToObject(tenant)
            });
        })
        .catch(next);
})

app.get('/manage/room_manage/function/declare/:id/contract', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>res.render('tenants/contract', {
            tenant: mongooseToObject(tenant)
        }))
        .catch(next);
})

app.get('/manage/room_manage/function/declare/:id/input-contract', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>res.render('tenants/input-contract', {
            tenant: mongooseToObject(tenant)
        }))
        .catch(next);
})

app.put('/manage/room_manage/function/declare/:id', (req, res, next)=>{
    Tenant.updateOne({_id: req.params.id}, req.body)
        .then(()=>{
            res.redirect('/manage/room_manage/function/declare');
        })

        .catch(next);
})

app.get('/manage/room_manage/function/tenant/:id/edit-tenant', (req, res, next)=>{
    Tenant.findById(req.params.id)
        .then(tenant=>res.render('tenants/edit-tenant', {
            tenant: mongooseToObject(tenant)
        }))
        .catch(next);
})

app.put('/manage/room_manage/function/tenant/:id', (req, res, next)=>{
    Tenant.updateOne({_id: req.params.id}, req.body)
        .then(()=>{
            res.redirect('/manage/room_manage/function/tenant');
        })

        .catch(next);
})

//Delete
app.delete('/manage/room_manage/function/tenant/:id', (req, res, next)=>{
    Tenant.deleteOne({_id: req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next);
})

// Post tenant

app.post('/manage/room_manage/function/tenant', (req, res, next)=>{
    const formData = req.body;
    const tenant = new Tenant(formData);
    tenant.save()
        //Điều hướng trang web
        .then(()=>res.redirect('/manage/room_manage/function/tenant'))
        .catch(err=>{
        });
})

app.get('/manage/room_manage/function/manage-room-status',checkLogin , (req, res, next)=>{
    res.render('tenants/manage-room-status', {
        userData: mongooseToObject(req.data)
    });
})

app.get('/manage/room_manage/function', checkLogin, (req, res)=>{
    res.render('function', {
        userData: mongooseToObject(req.data)
    });
})

app.get('/manage/room_manage',checkLogin, (req, res, next)=>{
    Manage.find({})
        .then(manage=>{
            res.render('room_manage',{
                manage: mutipleMongooseToObject(manage)
            });
        })
        .catch(next)
})


//Lấy thông tin từ modal lưu vào cơ sở dữ liệu
app.post('/manage/room_manage', (req, res, next)=>{
    const formData = req.body;
    const manage = new Manage(formData);
    manage.save()
        //Điều hướng trang web
        .then(()=>res.redirect('/manage/room_manage'))
        .catch(err=>{
        });
})
app.get('/manage/room_manage/function/tenant', (req, res, next)=>{
    
    Tenant.find({})
        .then(tenant=>{
            res.render('tenants/tenant', {
                tenant: mutipleMongooseToObject(tenant)
            });
        })
        .catch(next);
})

// Edit room
app.get('/manage/room_manage/:id/edit', (req, res, next)=>{
    Manage.findById(req.params.id)
        .then(manage=>res.render('tenants/edit', {
            manage: mongooseToObject(manage)
        }))

        .catch(next);
})

//Update room
app.put('/manage/room_manage/:id', (req, res, next)=>{
    Manage.updateOne({_id: req.params.id}, req.body)
        .then(()=>{
            res.redirect('/manage/room_manage');
        })

        .catch(next);
})


app.delete('/manage/room_manage/:id', (req, res, next)=>{
    Manage.deleteOne({_id: req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next);
})






app.get('/manage', checkLogin, (req, res)=>{
    res.render('manage', {
        userData: mongooseToObject(req.data)
    });
})


app.get('/about', getInfoLogin, (req, res)=>{
    res.render('about', {
        userData: mongooseToObject(req.data)
    });
})

app.get('/', getInfoLogin, function (req, res, next) {

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
});


app.get('/hot-news/:page', getInfoLogin, function (req, res, next) {
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
});



app.get('/search-result', getInfoLogin, function(req, res, next){
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
                    results: mutipleMongooseToObject(result),
                    userData: mongooseToObject(req.data)
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
                    results: mutipleMongooseToObject(result),
                    userData: mongooseToObject(req.data)
                })
            })
            .catch(next);
    }
    
})



app.get('/news/post', checkLogin, (req, res, next) => {
    res.render('news/post', {
        userData: mongooseToObject(req.data)
    });
});


app.post('/news/store', checkLogin, (req, res, next) => {
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
    if(imgArray.length == 0){
        imgArray = ['/src/public/img/tro1.jpg', '/src/public/img/tro2.jpg', '/src/public/img/tro3.jpg']
    }
    const data = req.body;
    const news = new New({
        userId: req.data._id,
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
        req.session.message = {
            type: 'success',
            intro: 'Successful posting',
            message: '!'
        }
        res.redirect('/news/post');
    });
    
});



app.get('/news/:id/edit', checkLogin, (req, res, next) => {
    New.findById(req.params.id)
        .then(news => res.render('news/edit', {
            new: mongooseToObject(news),
            userData: mongooseToObject(req.data)
        }))
        .catch(next)
})

app.put('/news/:id', checkLogin, (req, res, next) => {
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

app.delete('/news/:id', checkLogin, (req, res, next) => {
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

app.get('/news/:slug', getInfoLogin, (req, res, next) => {
    New.findOne({ slug: req.params.slug })
        .then(oneNew => {
            res.render('news/show', {
                oneNew : mongooseToObject(oneNew),
                isNewsPage: true,
                userData: mongooseToObject(req.data)
            });
        })
        .catch(next);
});



app.get('/features/top-up', checkLogin, function (req, res) {
    res.render('features/top-up', {
        userData: mongooseToObject(req.data)
    });
});

app.get('/users', (req, res, next) => {
    res.render('authen/access', {
        layout: false,
        userData: mongooseToObject(req.data)
    });
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
    // let isAdmin = (req.data.role === 'admin') ? true : false
    res.render('me/deposit-history', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data),
        // isAdmin
    });
});

app.get('/me/payment-history', checkLogin, function(req, res) {
    // let isAdmin = (req.data.role === 'admin') ? true : false
    res.render('me/payment-history', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data),
        // isAdmin
    });
});

app.get('/me/news-management', checkLogin, function(req, res, next) {
    New.find({userId: req.data._id})
        .then(news => {
            res.render('me/news-management', {
                news: mutipleMongooseToObject(news),
                layout: 'dashboard.hbs',
                userData: mongooseToObject(req.data)
            });
        })
        .catch(next)
    
});

app.get('/me', checkLogin, function(req, res) {
    res.render('me/pages-profile', {
        layout: 'dashboard.hbs',
        userData: mongooseToObject(req.data)
    });
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
            user: mongooseToObject(user),
            userData: mongooseToObject(req.data)
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



app.get('/admin/account-manage/add-user', checkLogin, checkAdmin, (req, res, next) => {
    res.render('admin/add-user', {
        layout: 'dashboard',
        userData: mongooseToObject(req.data)
    });
});


app.post('/admin/account-manage/store', checkLogin, checkAdmin, (req, res, next) => {

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

app.get('/admin/news-management', checkLogin, checkAdmin, function(req, res, next) {
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



app.get('/forgot', (req, res, next) => {
    res.render('authen/forgot', { layout: false })
})

app.post('/forgot/get-email', (req, res, next) => {
    User.find({email: req.body.email})
        .then(user => {
            if(user.length > 0){
                let verifyCode = Math.floor(100000 + Math.random() * 900000);
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: 'phongtrotot.hotro@gmail.com',
                    pass: 'phongtrotot'
                    }
                });
                
                var mailOptions = {
                    from: 'phongtrotot.hotro@gmail.com',
                    to: req.body.email,
                    subject: 'Reset Password | by PhongTroTot ',
                    html: `<div style="background: #E2F4FC; height: 100%; width: 100%; font-family: 'Segoe UI', sans-serif; text-align: center;"> <img src="https://i.imgur.com/ObCBMsX.png" style="margin: 20px;" > <h2 style="padding: 0 30px;">Your confirmation code is: <span style="color: red;">${verifyCode}</span></h2> <small style="border-bottom: 1px solid #ccc; margin-bottom: 18px; padding: 0 30px 18px; text-align: center; display: block; font-size: 13px;">(*) Return to <a href="http://localhost:3000/forgot#profile">the page</a>, enter this code in the confirmation code box to change your password</small> <small style="padding: 0 30px 18px; text-align: center; display: block;">All Rights Reserved by <span style="color: #22517E;">PhongTroTot</span> - Team 3 (Duy Tan University)</small> </div>`
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        req.flash('email', req.body.email)
                        req.flash('verifyCode', verifyCode)
                        res.redirect('back')
                    }
                });
            }
            else {
                req.session.message = {
                    type: 'danger',
                    intro: 'Failed!',
                    message: 'This email account does not exist.'
                }
                res.redirect('/forgot')
            }
        })
        .catch(next)
    
})

app.put('/forgot/confirm', (req, res, next) => {
    const data = req.body;
    let email = req.flash('email')
    let verifyCode = req.flash('verifyCode')
    if(verifyCode == data.verifyCode){
        User.updateOne({email: email}, data)
            .then(() => {
                req.session.message = {
                    type: 'success',
                    intro: 'Successfully!',
                    message: 'Your password has been changed.'
                }
                res.redirect('/users')
            })
            .catch(next)
    }
    else {
        req.session.message = {
            type: 'danger',
            intro: 'Failed!',
            message: 'Confirmation code is wrong.'
        }
        res.redirect('/forgot')
    }
})


//Error handling page
app.get('/error/403', function(req, res) {
    res.render('error/403-forbidden', {layout: false});
});
app.get('/error/404', function(req, res) {
    res.render('error/error-404', {layout: false});
});



app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


