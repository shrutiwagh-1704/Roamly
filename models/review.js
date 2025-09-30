const { ref } = require("joi");
const mongoose=require("mongoose");

const Review_Schema=new mongoose.Schema(
    {
        rating:
        {
            type:Number,
            min:1,
            max:5
           
        },
         
        comment:
        {
            type:String,
        },

        CreatedAt:
        {
            type:Date,
            default:Date.now()
        },

        author:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
)




console.log("Review model loaded"); // Add this line
const review=mongoose.model("review_collection",Review_Schema);
module.exports=review;

