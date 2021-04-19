const express = require("express")
const router = express.Router();
const User = require("../../models/User")
const bcrypt = require("bcrypt")
const bSalt = 10

router.get("/", (req, res, next) => {
    res.render("users/auth/signup-page")
})


router.post("/signup", (req, res, next) => {
    // get the username and password from the request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // make sure that we have both of the fields as nonempty characters // it is not a bad idea for this to also be done on the frontend
    if (firstName === "" || lastName === "" || username === "" || password === "" || email == "") {
        res.render("users/auth/signup-page", {
            message: "All the field are required."
        });
        return;
    }

    // check if the username is already registered in the database and if so return the message
    User.findOne({ username: username })
        .then(user => {
            if (user !== null) {
                res.render("users/auth/signup-page", {
                    message: "The username already exists"
                });
                return;
            }

            // if all of the checks have passed we encrypt the password and create a new user
            const salt = bcrypt.genSaltSync(bSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashPass
            });

            // save new user to the database and then set his session
            newUser
                .save()
                .then(newlyCreatedUser => {
                    // we will automatically sign in the user after they sign up so that they do not have to later go to login screen after the signup
                    req.session.user = newlyCreatedUser;
                    res.redirect("/");
                })
                .catch(err => {
                    console.log(err);

                    // if there was an error we will render the same page the user is on and this time pass a variable that can be used there. In this case it will be a message to display the error
                    res.render("users/auth/signup-page", {
                        message: "Something went wrong"
                    });
                });
        })
        .catch(err => next(err));
});

module.exports = router;
