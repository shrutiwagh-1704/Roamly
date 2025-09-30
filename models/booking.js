const mongoose=require("mongoose");
const { date } = require("joi");



const booking_Schema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },

        email:
        {
            type:String,
            required:true
        },
         
        
        checkIn: {
            type: Date,   // better use Date type
            required: true
        },

        checkOut: {
            type: Date,   // better use Date type
            required: true
        },

        user:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"     // Model name (first parameter in mongoose.model())
                                            // References the model name, not the variable or collection name
            }
        ],

        listing:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"listing_collection"     // Model name (first parameter in mongoose.model())
                                            // References the model name, not the variable or collection name
            }
        ],

        

        
    }
);


const booking=mongoose.model("booking_collection",booking_Schema);
module.exports=booking;
