const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose');
const saltRounds = 10;

const User = require("../../models/User");
const routeGuard = require('../../configs/route-guard.config')


//SIGNUP ROUTES
router.get("/signup", (req, res) => {
    res.render("users/auth/signup-page")
})

router.post("/signup", (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !password || !email) {
        res.render("users/auth/signup-page", {
            message: "All the field are required..."
        });
        return;
    }
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPasswd => {
            return User.create({
                firstName, lastName, username, email, password: hashedPasswd
            })
                .then(user => res.render('users/auth/login-page', { user }))
                .catch(err => {
                    if (err instanceof mongoose.Error.ValidationError) {
                        res.status(500).render('/signup', { message: err.message });
                    } else if (err.code === 11000) {
                        res.status(500).render('/signup', {
                            message: 'Username and email need to be unique. Either username or email is already used.'
                        });
                    } else {
                        next(err);
                    }
                });
        })
        .catch(err => next(err));
});


//LOGIN ROUTES

router.get("/login", (req, res, next) => {
    res.render("users/auth/login-page")
})

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('users/auth/login-page', { message: 'All fields are mandatory. Please provide your both, username and password.' });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('/users/auth/login-page', { message: 'Username is not registered. Try with different username.' });
                return;
            } else if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                console.log('==========')
                res.render('users/profile', { user });
            } else {
                res.render('/users/auth/login-page', { message: 'Incorrect password.' });
            }
        })
        .catch(err => next(err));
});

// LOGOUT ROUTE

router.post('/logout', routeGuard, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// USER PROFILE
router.get('/userProfile', routeGuard, (req, res) => {
    console.log('USER IN SESSION: ', req.session.currentUser);
    res.render('users/profile');
});



module.exports = router;
