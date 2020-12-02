const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = mongoose.Schema({
    img: {
        type: String,
        default: '/src/public/img/coverlogo.png',
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    role: {
        type: String,
    },
    phoneNumber: String,
    message: String,
    gender: String,
}, {
    timestamps: true,
})


const User = mongoose.model('User', userSchema)

module.exports = User;