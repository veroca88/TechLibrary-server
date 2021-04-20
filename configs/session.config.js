const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                sameSite: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60000,
                store: new MongoStore({
                    mongooseConnection: mongoose.connection,
                    collection: 'session',
                    ttl: 60 * 60 * 24 // 1 day
                })
            }
        })
    )
};

