const mongoose=require("mongoose");
const Review = require("./review");



const Listing_Schema=new mongoose.Schema(
    {
        title:
        {
            type:String,
            required:true
        },
         
        description:
        
        {
            type:String,
        },
        image:
        {
    
            // filename:
            // {
            //     type:String,
            // },
            // url:
            // {
            //     type:String,
            //     default:"https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            //     set:(v)=>
            //     v===""
            //     ?"https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
            // }

            url:String,
            filename:String
        },
        price:
        {
            type:Number,
        },
        location:
        {
            type:String,
        },
        country:
        {
            type:String
        },
        review:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"review_collection"     // Model name (first parameter in mongoose.model())
                                            // References the model name, not the variable or collection name
            }
        ],
        owner:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    
    }
);

// post middleware when findByIdAndDelete calls automatically this called 
// when we delete the whole listing then in database also review related to these listing get deletes so we do this for that 
Listing_Schema.post("findOneAndDelete",async(listing)=>
{
    if(listing)
    {
        let deletereviws=await Review.deleteMany({_id:{$in:listing.review}})
        console.log(deletereviws);
    }

})


const listing=mongoose.model("listing_collection",Listing_Schema);
module.exports=listing;
