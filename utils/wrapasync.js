// const wrapasyncfunction =(fn)=>
// {
//     return (req,res,next)=>
//     {
//         fn(req,res,next).catch(next)
//     }
// }

// function wrapasyncfunction(fn)
// {
//     return function(req,res,next)
//     {
//         console.log("wrapasync error",err);
//         fn(req,res,next).catch(next);
//     }
// }

const wrapasyncfunction = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.log("Actual error:", err); // Show real error
            next(err);
        });
    }
}

module.exports=wrapasyncfunction;