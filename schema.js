const Joi = require("joi");

// listings validation
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "any.required": "Please provide a title!",
            "string.empty": "Title cannot be left blank"
        }),

        description: Joi.string().required().messages({
            "any.required": "Please provide a description!",
            "string.empty": "Description is required!"
        }),

        location: Joi.string().required().messages({
            "any.required": "Please provide a location!",
            "string.empty": "Location must be specified"
        }),

        country: Joi.string().required().messages({
            "any.required": "Please provide a country!",
            "string.empty": "Country is required"
        }),

        price: Joi.number().required().min(0).messages({
            "any.required": "Please set a price per night",
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative! You deserve to get paid"
        }),

        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).optional().messages({
            "string.uri": "Please provide a valid image URL"
        }).optional().allow(null, ""),
        
        category: Joi.string().valid(
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Others"
        ).required()

    }).required().messages({
        "any.required": "Listing data is missing entirely!"
    })

}).required().messages({
    "any.required": "NO DATA!"
});

// reviews validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).messages({
            "number.min": "Rating must be at least 1 star",
            "number.max": "Rating cannot exceed 5 stars",
            "any.required": "Please provide a rating"
        }),
        comment: Joi.string().required().messages({
            "any.required": "Comment is required for a review",
            "string.empty": "Please write a short comment about your experience"
        })
    }).required().messages({
        "any.required": "Review is missing!"
    })
}).required().messages({
    "any.required": "NO DATA!"
});
