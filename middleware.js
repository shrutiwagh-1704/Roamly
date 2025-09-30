const listing=require("./models/listing");
const {serverListingValidator,serverreviewValidator}=require("./Serverschema_validation.js");
const ExpressError=require("./utils/ExpressError.js");



const loggedin=((req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","First login to add new listing ");
        return res.redirect("/users/login");
    }
    next();
})

const saved_path=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
    

}

const isowner=(async(req,res,next)=>
{
    let {id}=req.params;
    let listing_edit=await listing.findById(id);
    if(!res.locals.currentuser._id.equals(listing_edit.owner._id))
    {
        req.flash("error","you are not autorize to edit this");
        return res.redirect(`/listing/${id}`);
    }

    next();
})

const validator=((req,res,next)=>
{
    let {error}=serverListingValidator.validate(req.body);
    console.log(error);
    if(error)
    {
        
        throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
})

// review validator 

const review_validator = (req, res, next) => {
    
    let { error } = serverreviewValidator.validate(req.body);
    console.log("error from review validator", error);

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, msg));
    } else {
        next();
    }
};

module.exports={loggedin,saved_path,isowner,validator,review_validator};
