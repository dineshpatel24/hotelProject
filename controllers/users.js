// controllers/users.js
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password); // ⬅️ hashes password
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WunderLust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    });
};
