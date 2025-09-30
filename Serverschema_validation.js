const Joi = require('joi');

const serverListingValidator  = Joi.object({
    Listing:Joi.object(
        {
            title:Joi.string().required(),
            description:Joi.string().required(),
            price:Joi.number().required(),
            location:Joi.string().required(),
            country:Joi.string().required(),
            image: Joi.object({
                url: Joi.string().allow('')  // If image URL is optional or can be empty
                }).optional()
        }
    ).required()
})

const serverreviewValidator  = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()

    }).required()
})


module.exports = { serverListingValidator, serverreviewValidator };