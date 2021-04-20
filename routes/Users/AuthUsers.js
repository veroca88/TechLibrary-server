const express = require("express")
const router = express.Router();
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const saltRounds = 10

router.get("/signup", (req, res, next) => {
    res.render("users/auth/signup-page")
})




// make sure that we have both of the fields as nonempty characters // it is not a bad idea for this to also be done on the frontend
// 

router.post("/signup", (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body
    if (firstName === "" || lastName === "" || username === "" || password === "" || email === "") {
        res.render("users/auth/signup-page", {
            message: "All the field are required..."
        });
        return;
    }
    User.findOne({ username: username })
        .then(user => {
            if (user !== null) {
                res.render("users/auth/signup-page", {
                    message: "Thy another username, this one already exist!"
                });
                return;
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPass = bcrypt.hashSync(password, salt);

            let newUser = new User({ firstName, lastName, username, email, password: hashPass });
            newUser
                .save()
                .then(createdUser => {
                    req.session.user = createdUser;
                    res.redirect("/login");
                })
                .catch(err => {
                    console.log(err); res.render("users/auth/signup-page", {
                        message: "Please try again! Something went wrong... "
                    });
                });
        })
        .catch(err => next(err));
});


router.get("/login", (req, res, next) => {
    res.render("users/auth/login-page")
})

module.exports = router;
