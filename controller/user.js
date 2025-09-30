const User=require("../models/user");

const signup=async(req,res)=>
{
    try
    {
        let {username,email,password}=req.body;
        let newuser=new User({email,username});
        const registerdUser=await User.register(newuser,password);
        // after signup register user is aslo get login so for it 
        req.login(registerdUser,(err)=>
        {
            if (err) { return next(err); }
            req.flash("success",`welcome to Roamly ${req.user.username}`);
            return res.redirect("/listing/showlisting");
        })
        console.log(registerdUser);
        
        
    }
    catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/users/signup");
    }
    

}


const login=async(req,res)=>
{
    req.flash("success",`Welcome back to Roamly ${req.user.username}`);
    let redirectUrl=res.locals.redirectUrl || "/listing/showlisting";
    console.log(redirectUrl);
    if(redirectUrl)
    {
        res.redirect(redirectUrl);
    }
    
}

const logout=((req,res)=>
{
    req.logout((err)=>
    {
        if(err)
        {
            next(err);
        }
        else
        {
            req.flash("success","you'r logout successfully");
            res.redirect("/listing/showlisting")
        }
    })
})
module.exports={signup,login,logout}