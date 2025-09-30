const listing=require("../models/listing.js");
const Review=require("../models/review.js");

const addreview=async(req,res)=>
{

    if(!req.body.review)
    {
        next(new ExpressError(400, "review is missing.."));
    }
    
        let {id}=req.params;
        const newreview=new Review(req.body.review);
        newreview.author=req.user._id;
        await newreview.save();
        // After saving a new document, pushing the full document works because Mongoose extracts the _id automatically.

        let listinginfo=await listing.findById(id);
        listinginfo.review.push(newreview);    //newreview is added in db so now mongoose can extract id now ..
        await listinginfo.save();

        console.log("data saved");
        // res.send("review added");
        res.redirect(`/listing/${id}`);

    
}

const delete_review=async(req,res)=>
{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})   //$pull=> pull the reviewId and remove from listing 
    res.redirect(`/listing/${id}`);
}
module.exports={addreview,delete_review};