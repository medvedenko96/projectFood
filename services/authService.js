const passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
require('../middleware/passport');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.login = (req, res) => {
    if (!req.body.nickname || !req.body.password) {
        responseJSON(res, 400, {
            "message": "All fields required."
        });
        return;
    }

    passport.authenticate('local', (err, user, info) => {
        let token;

        if (err) {
            console.log(err);
            responseJSON(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            responseJSON(res, 200, {
                "token": token
            });

        } else {
            responseJSON(res, 401, info);
        }
    })(req, res);
};

module.exports.register =  (req, res) => {
    if (!req.body.nickname || !req.body.weight || !req.body.growth || !req.body.age
        || !req.body.password || !req.body.activity) {
        responseJSON(res, 400, {
            'message': "All fields required."
        });
        return;
    }

function calories (weight, growth, age, sex) {
    if (sex === "man") {
        return 88.362 + (13.397 * weight) + (4.799 * growth) - (5.677 - age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * growth) - (4.330 - age);
    }
}

function activ(value, activity) {
    if (activity === 'gain') {
        return value * 1.15
    } else if (activity === 'maintain') {
        return value
    } else if (activity ===  'lose') {
        return value * 0.8
    }
}

function IMT (growth, weight) {
    growth /= 100;
    return weight / (Math.pow(growth, 2))
}

function resultIMT(value) {
    if (value < 18.5) {
        return 'Недостатня маса'
    } else if (18.5 > value < 24.9) {
        return 'Норма'
    } else if (value > 25) {
        return 'Надлишкова маса'
    }
}
    //calories(req.body.weight, req.body.growth, req.body.age, req.body.sex)
    let newUser = new User();
    newUser.nickname = req.body.nickname.toLowerCase();
    newUser.weight = req.body.weight;
    newUser.growth = req.body.growth;
    newUser.age = req.body.age;
    newUser.activity = req.body.activity;
    newUser.sex = req.body.sex;
    newUser.normalCalories = activ(calories(req.body.weight, req.body.growth, req.body.age, req.body.sex), req.body.activity);
    newUser.sex = req.body.sex;
    newUser.IMT = IMT(req.body.growth, req.body.weight);
    newUser.resultIMT = resultIMT(IMT(req.body.growth, req.body.weight));
    newUser.setPassword(req.body.password);

    newUser.save((err) => {
        let token;
        if (err) {
            responseJSON(res, 404, err);
        } else {
            token = newUser.generateJwt();
            responseJSON(res, 200, {
                "token" : token
            });
        }
    })
};

