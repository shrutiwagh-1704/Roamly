const {data}=require("./data");
const listing=require("../models/listing");
const mongoose=require("mongoose");

main()
.then((res)=>
{
    console.log("database connected");
    
})
.catch((err)=>
{
    console.log(err);
})
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/Roamly");
}

const addData=async ()=>
{
    await listing.deleteMany({});
    await listing.insertMany(data);

}

addData().then((res)=>
{
    console.log("Data added..")
})
.catch((err)=>
{
    console.log(err);
})