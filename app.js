if(process.env.NODE_ENV!="production")
{
    require('dotenv').config()
}


// console.log(process.env) 


const express=require("express");
const app=express();

const mongoose=require("mongoose");

const path=require("path");
var methodOverride = require('method-override');
engine = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const mongo_url="mongodb://127.0.0.1:27017/Roamly";
const db_url=process.env.db_url;




const port=8080;

app.listen(port,()=>
{
    console.log("server is listening at port 8080");
});

main()
.then((res)=>
{
    console.log("mongodb connected");
})
.catch((err)=>
{
    console.log(err);
})

async function main()
{
    await mongoose.connect(db_url)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method')); 
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
const ExpressError=require("./utils/ExpressError.js");


// Router
const listing_router=require("./router/listing_routing.js");
const review_router=require("./router/review_routing.js");
const user_router=require("./router/user_routing.js");

// authenticaltion
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.secret
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>
{
    console.log("ERROR IN MONGO STORE",err);
})

const sessionOption={
    store,
    secret:process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Ensure req.body is always an object
app.use((req, res, next) => {
    if (!req.body) req.body = {};
    next();
});

// flash msges
app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
})

// follow routes
app.use("/listing",listing_router);
app.use("/review",review_router);
app.use("/users",user_router);


// app.get("/demouser",async(req,res)=>
// {
//     let fakeUser=new User({
//         email:"shruti@gmail.com",
//         username:"delta-student"
//     });
//     let registerUser=await User.register(fakeUser,"stayStrong");
//     res.send("user set");
// })




app.use((req,res,next)=>
{
    next(new ExpressError(404,"page not found")); // Use next() instead of throw
})

// error handler 
app.use((err,req,res,next)=>
{
    let {statuscode=500,message="Something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{statuscode ,message});
})

