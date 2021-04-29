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
            errMessage: "All the field are required..."
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup-page", {
                    errMessage: "The username already exists!"
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
                                res.status(500).render('/signup', { errMessage: err.message });
                            } else if (err.code === 11000) {
                                res.status(500).render('/signup', {
                                    errMessage: 'Username and email need to be unique. Either username or email is already used.'
                                });
                            } else {
                                next(err);
                            }
                        });
                })
                .catch(err => next(err));
        });
})


//LOGIN ROUTES

router.get("/login", (req, res, next) => {
    res.render("auth/login-page")
})

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/login-page', { errMessage: 'All fields are mandatory. Please provide username and password.' });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-page', { errMessage: 'Username is registered. Try with different username.' });
                return;
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.render('boards/boardForm', { user });
            } else {
                res.render('auth/login-page', { errMessage: 'Incorrect password.' });
            }
        })
        .catch(err => next(err));
});

// LOGOUT ROUTE

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// DELETE ACCOUNT

router.post('/profile/:userId/delete', routeGuard, (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(() => {
            req.session.destroy();
            res.redirect("/")
        })
        .catch(err => console.log(`Err while deleting the user account from the  DB: ${err}`));
});


// USER PROFILE
router.get('/profile', routeGuard, (req, res) => {
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
