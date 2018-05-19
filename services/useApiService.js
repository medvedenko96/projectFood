//const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const axios = require('axios');
const verifyToken = require('../utils/verifyToken');
require ('dotenv'). config ();

/*
module.exports.getRecipe = (req, res) => {
    let url = `https://api.edamam.com/search?q=chicken&app_id=${process.env.YOUR_APP_ID}&app_key=${process.env.YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free`;
    request(url,
        (err, res, body) => {
            if(err) {
                throw new  Error
            }
            console.log(body);
        })
};
*/


module.exports.getRecipe = (req, res) => {
    let user = verifyToken(req.headers.authorization);

    User.findOne({_id : user._id}, function(err, user) {
        if(err) {
            throw new  Error
        }
        let calories = (user.normalCalories / 3).toFixed(0);
        let url = `https://api.edamam.com/search?q=${req.body.search}&app_id=1ca86759&app_key=f6e5c0fa03cf1b5deface070ce8eaa3e&from=0&to=3&calories=${calories - 100}-${calories + 100}`;
        axios.get(url)
            .then(function (response) {
                res.send(response.data)
            })
            .catch(error => { console.log(error.message); });

    });
};