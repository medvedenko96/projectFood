const mongoose = require('mongoose');
const User = mongoose.model('User');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};
const verifyToken = require('../utils/verifyToken');


module.exports.readOne = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    User.findOne({_id : user._id}, function(err, document) {
        if (err) {throw new Error}
        responseJSON(res, 200, document)
    });
};

module.exports.update = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    function calories (weight, growth, age, sex) {
        if (sex === "man") {
            return 88.362 + (13.397 * weight) + (4.799 * growth) - (5.677 - age);
        } else {
            return 447.593 + (9.247 * weight) + (3.098 * growth) - (4.330 - age);
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

    function activ(value, activity) {
        if (activity === 'gain') {
            return value * 1.15
        } else if (activity === 'maintain') {
            return value
        } else if (activity ===  'lose') {
            return value * 0.8
        }
    }

    User.findOne({_id : user._id}, function(err, user) {

        if (err) {throw new Error}
        if (req.body.nickname !== undefined) {
            user.nickname = req.body.nickname
        }
        if (req.body.weight !== undefined) {
            user.weight = req.body.weight
        }
        if (req.body.growth !== undefined) {
            user.growth = req.body.growth
        }
        if (req.body.age !== undefined) {
            user.age = req.body.age
        }
        if (req.body.activity !== undefined) {
            user.activity = req.body.activity
        }
        if (req.body.sex !== undefined) {
            user.sex = req.body.sex
        }

            user.normalCalories = activ(calories(user.weight || req.body.weight,
                user.growth || req.body.growth,
                user.age || req.body.age, user.activity || req.body.activity),user.activity || req.body.activity);

            user.IMT =  IMT(req.body.growth || user.growth, req.body.weight || user.weight);

            user.resultIMT = resultIMT(IMT(req.body.growth || user.growth, req.body.weight || user.weight));

        if (req.body.password !== undefined) {
            user.salt = '';
            user.hash = '';
            user.setPassword(req.body.password);
        }
        user.save(function (err) {
            if (err){
                return res.status(500).send(err.message)
            } else {
                return responseJSON(res, 200, user)
            }
        });
    });
};

module.exports.delete = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.nickname === undefined) {
        responseJSON(res, 400, {
            "message": "Nickname is undefined"
        })
    }

    User.findOne({_id: user._id}, function (err, user) {
        if (err) {
            return res.status(500).send(err.message)
        }
        user.remove(function (err) {
            if (err) {
                return res.send(500, err.message)
            } else {
                res.status(200).send(`User delete`)
            }
        });
    });
};