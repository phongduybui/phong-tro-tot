const jwt = require('jsonwebtoken')
const accessTokenSecret = 'phong'; 
const User = require('../models/User')

const checkLogin = async(req, res, next) => {
    try {
        var token = req.cookies.token;
        var idUser = jwt.verify(token, accessTokenSecret)

        User.findOne({ _id: idUser})
            .then(data => {
                //Gan data cho req de route su dung vi req, res, next chung
                req.data = data;
                if(data){
                    next()
                } else {
                    res.json('Not Permisson!!')
                }
            })
            .catch(err => {
                res.json('Loi server');
            })
        

    }catch(error) {
        //ban can phai login
        res.redirect('/users')
    }
}

const checkTenant = async (req, res, next) => {
    let role = req.data.role;
    if(role === 'tenant' || role === 'host' || role === 'admin'){
        next()
    } else {
        res.redirect('/error/403');
    }
}

const checkHost = async (req, res, next) => {
    let role = req.data.role;
    if(role === 'host' || role === 'admin'){
        next()
    } else {
        res.redirect('/error/403');
    }
}

const checkAdmin = async (req, res, next) => {
    let role = req.data.role;
    if(role === 'admin'){
        next()
    } else {
        res.redirect('/error/403');
    }
}


module.exports = {
    checkLogin,
    checkTenant,
    checkHost,
    checkAdmin
}