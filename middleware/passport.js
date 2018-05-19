const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new localStrategy({
        usernameField: 'nickname',
        session: false
    },
    (nickname, password, done) => {
        User.findOne({nickname: nickname}, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        })
    }
));