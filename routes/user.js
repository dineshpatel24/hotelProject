const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');
const users = require('../controllers/users');

// SIGNUP
router.route('/signup')
    .get(users.renderSignupForm)
    .post(wrapAsync(users.signup));

// LOGIN
router.route('/login')
    .get(users.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }),
        users.login
    );

// LOGOUT
router.get('/logout', users.logout);

module.exports = router;
