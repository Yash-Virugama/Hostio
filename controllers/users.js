const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });

        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);

        // direct login after signup function
        req.login(registeredUser, (err, next) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Hostio!");
            res.redirect("/listings");
        });

    } catch (err) {

        if (err.code === 11000) {
            req.flash("error", "A user with the given email is already registered!");
            return res.redirect("/signup");
        } else {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
    }
}

module.exports.loginForm = (req, res) => {
    // Only look for a Referer if isLoggedIn DID NOT already save a path
    if (!req.session.redirectUrl) {

        // Check if they came from a specific page (and not a login/signup page)
        const referer = req.get("Referer");
        if (referer) {
            try {
                const urlPath = new URL(referer).pathname;
                if (urlPath !== "/login" && urlPath !== "/signup") {
                    req.session.redirectUrl = urlPath; // Save the show page path to session
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Hostio!");
    // console.log(res.locals.redirectUrl);
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Your are logged out!");
        res.redirect("/listings");
    })
}

module.exports.privacy = (req, res) => {
    res.render("privacy.ejs"); 
}

module.exports.terms = (req, res) => {
    res.render("terms.ejs"); 
}