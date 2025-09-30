const express=require("express");
const router =express.Router();
const User=require("../models/user");
const passport=require("passport");
const wrapasyncfunction=require("../utils/wrapasync.js");
const {saved_path}=require("../middleware");
const {signup,login,logout}=require("../controller/user.js");

router.get("/signup",(req,res)=>
{
    res.render("./users/signup.ejs");
});

router.post("/signup",signup);

router.get("/login",(req,res)=>
{
    res.render("./users/login.ejs");
})

router.post("/login",saved_path,passport.authenticate('local', { failureRedirect: '/users/login', failureFlash:true }),
wrapasyncfunction(login))

router.get("/logout",logout)

module.exports=router;