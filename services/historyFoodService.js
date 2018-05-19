const mongoose = require('mongoose');
const User = mongoose.model('User');
const History = mongoose.model('HistorySchema');
const verifyToken = require('../utils/verifyToken');
require ('dotenv'). config ();

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};
module.exports.add = (req, res) => {
    let user = verifyToken(req.headers.authorization);

    let newDish = new History();
    newDish.dish = req.body.dish;

    newDish.save((err) => {
        if (err) {
            responseJSON(res, 404, err);
        } else {
            responseJSON(res, 200, {
                'message': "Add dish"
            });
        }

    });

    let dish_id = newDish._id;
    User.update( {_id: user._id},
        {$push: { historyFood: dish_id}},
        (err) => {
            if(err) {
                console.error(err.message);
                throw new  Error
            }
        });
};

module.exports.delete = () => {
    let user = verifyToken(req.headers.authorization);

};