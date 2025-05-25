const Joi = require("joi");

// for listing
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("",null),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid("Airport","Budget","Bus-Park","Camping","City-Area","Domes","Eco-Friendly","Farms","Home-Stay","Lakes","Luxury","Mountains","River-Side").required(),
        contact: Joi.number().required(),
    }).required()
});

// for review
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});

// for signup
module.exports.signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

// for login
module.exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

// for forgetPassword
module.exports.forgetPasswordSchema = Joi.object({
    email: Joi.string().required()
});

// for resetPassword
module.exports.resetPasswordSchema = Joi.object({
    newPassword: Joi.string().required()
});

// for booking
module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        contact: Joi.number().required(),
        peopleno: Joi.number().required(),
        roomneeded: Joi.number().required(),
        checkin: Joi.date().required(),
        checkout: Joi.date().required()
    })
});