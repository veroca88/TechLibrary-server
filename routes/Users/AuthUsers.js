const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose');
const saltRounds = 10;

const User = require("../../models/User");
const routeGuard = require('../../configs/route-guard.config')


//SIGNUP ROUTES
router.get("/signup", (req, res) => {
    res.render("auth/signup-page")
})

router.post("/signup", (req, res, next) => {
    const { firstName, lastName, gender, username, email, password } = req.body;

    if (!firstName || !lastName || !gender || !username || !password || !email) {
        res.render("auth/signup-page", {
            message: "All the field are required..."
        });
        return;
    }
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPasswd => {
            return User.create({
                firstName, lastName, gender, username, email, password: hashedPasswd
            })
                .then(user => res.render('auth/login-page', { user }))
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
    res.render("auth/login-page")
})

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/login-page', { message: 'All fields are mandatory. Please provide your both, username and password.' });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-page', { message: 'Username is not registered. Try with different username.' });
                return;
            } else if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.render('users/profile', { user });
            } else {
                res.render('auth/login-page', { message: 'Incorrect password.' });
            }
        })
        .catch(err => next(err));
});

// LOGOUT ROUTE

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// USER PROFILE
router.get('/userProfile', routeGuard, (req, res) => {
    res.render('users/profile');
});

// GET ALL USERS
router.get('/allUsers', async (req, res) => {
    await User.find()
        .then(usersFromDB => {
            res.render('users/theTeam', { users: usersFromDB });
        })
        .catch(err => console.log(`Error while getting authors from DB: ${err}`));
});


module.exports = router;
