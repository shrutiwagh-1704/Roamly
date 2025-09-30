const express=require("express");
const router =express.Router();

const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const Review = require("../models/review.js");

const wrapasyncfunction=require("../utils/wrapasync.js");
const {serverListingValidator,serverreviewValidator}=require("../Serverschema_validation.js");
const ExpressError=require("../utils/ExpressError.js");
const {loggedin,review_validator}=require("../middleware.js");
const {addreview,delete_review}=require("../controller/review.js");




// adding review
router.post("/addreview/:id",
    loggedin,
    review_validator,
    wrapasyncfunction(addreview));

// deleting reviews
router.delete("/listing/:id/review/:reviewId",wrapasyncfunction(delete_review));


module.exports=router;