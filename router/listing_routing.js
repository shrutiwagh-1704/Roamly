const express=require("express");
const router =express.Router();

const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const wrapasyncfunction=require("../utils/wrapasync.js");
const {serverListingValidator,serverreviewValidator}=require("../Serverschema_validation.js");
const ExpressError=require("../utils/ExpressError.js");
// middleware to check loggedin or not 
const {loggedin, isowner,validator}=require("../middleware.js");
const {showlisting,addlisting,editlisting_form,editlisting,delete_listing,booking_form,newbooking,listing_info}=require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });



router.get("/showlisting",wrapasyncfunction(showlisting));

// get form to add new listing
router.get("/addnewlisting",loggedin,(req,res)=>
{
    res.render("./listings/newlisting");
})

// handle addition of new post
router.post("/addlisting",
    loggedin,
    upload.single('image'),
    validator,
    wrapasyncfunction(addlisting)
);

    



// get form to edit the info 
router.get("/editlisting/:id",loggedin,wrapasyncfunction(editlisting_form))

// actually edit the listing 
router.put("/editlisting/:id",
    isowner,
    loggedin,
    upload.single('image'),
    validator,
    wrapasyncfunction(editlisting));

// delete_listing
router.delete("/delete/:id",loggedin,wrapasyncfunction(delete_listing));

// book listing
router.get("/booking/:id",loggedin,wrapasyncfunction(booking_form));

// post booking
router.post("/booking/:id",loggedin,wrapasyncfunction(newbooking));

// specific listing 
router.get("/:id",loggedin,wrapasyncfunction(listing_info));

module.exports=router;