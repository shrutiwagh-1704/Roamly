const listing=require("../models/listing.js");
const booking=require("../models/booking.js");

const showlisting=async(req,res)=>
{

    const query = req.query.q;
    let alllistings;
    let count;
    if (query) 
    {
        alllistings = await listing.find({
        title: { $regex: query, $options: "i" }
        });
        count=alllistings.length;
    }
    else{
        alllistings=await listing.find({});
        count=alllistings.length;

        // count = await listing.countDocuments();
    }
    
    // console.log(alllistings);
    res.render("./listings/showalllisting",{alllistings,count});
}

const addlisting=async(req,res,next)=>
{
        
        // Step 1: Get form data 
        // const formData = req.body;
        // it gives object..
        // console.log(formData);
        
        // Step 2: Create new model instance using form data
        const addnewlisting = new listing(req.body.Listing);
    

        if(typeof req.file !== "undefined")
        {
            const url=req.file.path;
            const filename=req.file.filename;
            console.log("url : "+url+" filename: "+filename);

            addnewlisting.image={url,filename}
        }

        // console.log(req.user);
        // adding owner of listing 
        addnewlisting.owner=req.user._id;
        // console.log(addnewlisting);

        // Step 3: Save to database
        await addnewlisting.save();
        req.flash("success","New listing is added");
        
        res.redirect("/listing/showlisting");

}

const editlisting_form=async(req,res)=>
{
    let {id}=req.params;
    let view_listing=await listing.findById(id);
    // console.log(view_listing);
    res.render("./listings/editlisting",{view_listing});
}

const editlisting=async(req,res)=>
{
    let {id}=req.params;
    
    console.log("update req reach");

    let edited_listing=await listing.findByIdAndUpdate(id,
        {
            ...req.body.Listing
        },

        {new:true,runValidators:true}
    );


    // console.log("req.file.path" + req.file.path);

    if(typeof req.file !== "undefined")
    {
        const url=req.file.path;
        const filename=req.file.filename;
        edited_listing.image={url,filename}

        await edited_listing.save();
        console.log("update req reach");

    }
    req.flash("success","listing is edited !")
    res.redirect(`/listing/${id}`);

}



const delete_listing=async(req,res)=>
{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted !");
    res.redirect("/listing/showlisting");
}

// booking form
const booking_form=async(req,res)=>
{
    let {id}=req.params;
    let view_listing=await listing.findById(id);

    

    // console.log(view_listing);
    res.render("./booking/booking",{view_listing});
}

// post booking
const newbooking=async(req,res)=>
{

    let {id}=req.params;

    // Check if user already booked this listing
    const existingBooking = await booking.findOne({
        user: req.user._id,
        listing: id
    });

    if (existingBooking) {
        req.flash("error", "You already booked this listing!");
        return res.redirect(`/listing/${id}`);

    }

    const addbooking = new booking(req.body.booking);
    addbooking.user.push(req.user._id);
    addbooking.listing.push(id);

    // console.log(req.body.booking);
    await addbooking.save();

    let allbookings=await booking.find({});
    console.log(allbookings);
    req.flash("success","Booking confirmed! Payment details have been sent to your email. Please complete the payment within the deadline.");
    
    res.redirect("/listing/showlisting");
}

const listing_info=async(req,res)=>
{
    let {id}=req.params;
    let listing_details=await listing.findById(id)
     .populate({
        path: "review",
        populate: {
            path: "author"  // this will populate the user inside review
        }
    })
    .populate("owner");

    // Check if user already booked this listing
    const existingBooking = await booking.findOne({
        user: req.user._id,
        listing: id
    });

    // console.log(listing_details);
    if(!listing_details)
    {
        req.flash("error","listing you'r looking for is not exist");
        return res.redirect("/listing/showlisting");
    }

    // console.log(listing_details);
    res.render("./listings/showlist",{listing_details,existingBooking})
}

module.exports={showlisting,addlisting,editlisting_form,editlisting,delete_listing,booking_form,newbooking,listing_info}