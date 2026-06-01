const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.validateListing = (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Please upload an image!");
        return res.redirect("/listings/new");
    }

    let { error } = listingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

    } else {
        next();
    }
}

module.exports.validateUpdateListing = (req, res, next) => {
    // We skip checking if (!req.file) here because keeping the old image is allowed!
    
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);

    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        // original url where request goes
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        // If it came from a review delete action, clean up the path
        if (req.session.redirectUrl.includes("/reviews")) {
            res.locals.redirectUrl = req.session.redirectUrl.split("/reviews")[0];
        } else {
            res.locals.redirectUrl = req.session.redirectUrl;
        }
    } else {
        res.locals.redirectUrl = "/listings"; // Standard fallback
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
