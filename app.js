const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const passport = require('passport');
require ('dotenv'). config ();
require('./models/db');
require('./middleware/passport');

const app = express();

const routes = require('./routes/');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(jwt(
    { secret: process.env.SECRET })
    .unless(
        {path: ['/api/register', '/api/login', '/api/test']}
    ));

app.use(passport.initialize());

app.use('/api', routes);

app.use('/ky', (req, res, next) => {
    res.send('Hello MOC')
});

/*
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));