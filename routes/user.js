const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// for signup
router.route("/signup").get(userController.signUpForm).post(wrapAsync(userController.signUp));

// for login
router.route("/login").get(userController.loginForm).post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

// for logout
router.get("/logout", userController.logOut);

// privacy route
router.get("/privacy", userController.privacy);

// terms route
router.get("/terms", userController.terms);

module.exports = router;