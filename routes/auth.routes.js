const express = require("express")
const router = express.Router()
const passport = require("passport")
const bcrypt = require("bcrypt")
// const mongoose = require('mongoose')
const User = require("../models/user.model")
// const Guitar = require("../models/guitar.model")





//SIGN UP 

router.post('/signup', (req, res) => {

    const { name, username, password, email, phone } = req.body

    if (!name || !username || !password || !email || !phone) {
        res.status(400).json({ message: 'Empty fields' });
        return
    }
    // password.match(/[0-9]/) && password.match(/[A-Z]/) && password.match(/[a-z]/) && password.match(/[!$*]/) && password.length <= 6
    if (password.length < 2) {
        res.status(400).json({ message: 'Weak password' });
        return
    }
    // !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)
    let emailConfirm = new RegExp("[a-zA-Z0-9_.-]+@+[a-zA-Z0-9_.-]+.com+")
    if (!emailConfirm.test(email)) {
        res.status(400).json({ message: 'Wrong email' });
        return
    }

    User.findOne({ username }, (err, foundUser) => {

        if (err) {
            res.status(500).json({ message: "Username check error" });
            return
        }

        if (foundUser) {
            res.status(400).json({ message: 'Username taken' });
            return
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        const aNewUser = new User({
            name: name,
            username: username,
            password: hashPass,
            email: email,
            phone: phone,

        });

        aNewUser.save(err => {
            if (err) {
                res.status(500).json({ message: 'Error saving user to DB' });
                return
            }

            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(aNewUser, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login error' });
                    return
                }

                // Send the user's information to the frontend
                // We can use also: res.status(200).json(req.user);
                res.status(200).json(aNewUser)
            });
        });
    });
});




//LOGIN

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Error authenticating user' })
            return
        }

        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return
        }

        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session error' })
                return
            }

            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser)
        });
    })(req, res, next);
});





//LOGOUT

router.post('/logout', (req, res) => {

    req.logout();
    res.status(200).json({ message: 'Log out success!' })
});





//IS LOGGED IN

router.get('/loggedin', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user)
        return
    }
    res.status(403).json({ message: 'Unauthorized' })
});

module.exports = router