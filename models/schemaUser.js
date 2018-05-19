const crypto = require('crypto'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    moment = require('moment');
require ('dotenv'). config ();

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname : {
        type: String,
        required: true,
        unique: true
    },
    weight : {
        type: Number,
        required: true,

    },
    growth: {
        type: Number,
        required: true,

    },
    age : {
        type: Number,
        required: true,

    },
    activity: {
        type: String,
        required: true,

    },
    sex : {
        type: String,
        required: true,
    },
    normalCalories : {
        type: String,
        required: true,
    },
    IMT : {
        type: String,
        required: true,
    },
    resultIMT : {
        type: String,
        required: true,
    },
    historyFood :[{
    type: Schema.Types.ObjectId,
    ref: 'history'
    }],
    hash: String,
    salt: String ,
    createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY")
    }

});


userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};


userSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {

const SECRET = process.env.SECRET || 'EDWQCUNTHR3M4857CRMXQGZIWUSNYD452MCQXE-FR4WCXZ4TXGERFDSC435WXZFR4E-43RXF4ZRWEDVFX4EGRQWRXzd243rctgtrf-43txqfwzdvgerxwgdf';
    return jwt.sign({
        _id: this._id,
        nickname: this.nickname
    },
        SECRET,
    {
        expiresIn: '10 days'
    });
};



mongoose.model('User', userSchema);
