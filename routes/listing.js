const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, validateUpdateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingContoller = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index and create route
router.route("/").get(wrapAsync(listingContoller.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingContoller.createListing));

// new route
router.get("/new", isLoggedIn, listingContoller.renderNewForm);

// for search suggestions
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Ensure User model is imported

// GET /listings/suggestions
router.get("/suggestions", listingContoller.suggestions);

// show, update and delete route
router.route("/:id").get(wrapAsync(listingContoller.showListing)).put(isLoggedIn, isOwner, upload.single("listing[image]"), validateUpdateListing, wrapAsync(listingContoller.updateListing)).delete(isLoggedIn, isOwner, wrapAsync(listingContoller.destroyListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingContoller.renderEditForm));

module.exports = router;