const express = require('express');
const router = express.Router({mergeParams: true})
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utilities/CatchAsync')

router.get('/register',(req, res) => {
    res.render('register');
})

router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const { email,username, firstname, lastname, contactNumber , countryCode, password} = req.body;
        const user = new User({ email,username, firstname, lastname, contactNumber, countryCode });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Blog Page');
            res.redirect('/homepage');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }
}))


router.get('/login',(req, res) => {
    res.render('login');
})

router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/homepage';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Successfully Logout");
    res.redirect('/homepage');
})

module.exports = router;