const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            cookie: { maxAge: 3600000 },
            resave: true,
            saveUninitialized: true,
            duration: 24 * 60 * 60 * 1000,
            acrtiveDution: 1000 * 60 * 5,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60 * 60 * 24 // 1 day
            })
        })
    );
};


