const mongoose = require('mongoose');
const moment = require('moment');
require ('dotenv'). config ();
const Schema = mongoose.Schema;


const historySchema = new Schema({
    dish : {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY")
    }
});

mongoose.model('HistorySchema', historySchema);