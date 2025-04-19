const express= require("express");
const router= express.Router();
router.use(express.json());
const admindb= require("../config/db.js");
const jwt= require("jsonwebtoken");
const mongoose= require("mongoose");
const bcrypt= require("bcryptjs");
const saltRounds= 12;
const gentoken= require("../helpers/authUtils.js");
const loginmw= require("../helpers/loginMiddleWare.js");
const refresh_secret= process.env.refresh_secret;


//api to signup
router.post("/signup",async function(req,res){
    try{
        const body= req.body;  //firstname, lastname, email, password
        //create new user
        const newuser= await admindb.Admin.create({
            FirstName: body.FirstName,
            LastName: body.LastName,
            Email: body.Email,
            Password: await bcrypt.hash(body.Password,saltRounds)
        });

        res.status(200).json({
            msg:"Successfully created the user"
        });
    }catch(error){
        res.status(500).json({
            msg:"Unable to create the user",
            error: error
        });
    }
});

//api to signin
router.post("/signin",loginmw,async function(req,res){
    try{
        const body= req.body;
        const user= req.user;

        const comp= await bcrypt.compare(body.Password, user.Password);
        if(comp){
            const accesstoken= gentoken.genaccess(user.Email);  //creates the access token
            const refreshtoken= gentoken.genrefresh(user.Email);  //creates the refresh token

            //stores the refresh token in an HTTP-only cookie
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,  //Makes cookie inaccessible to Browser Javascript engine and only to http requests(security)
                sameSite: 'Lax',  //protects from csrf attacks- i.e. cookies will only be accessible by the requests sent from the same site, and not from different sites
                maxAge: 7*24*60*60*1000  //Refresh token are valid for 7 days
            });

            //return the access token in response body
            res.status(200).json({
                msg:"You have successfully logged-in",
                accesstoken: accesstoken
            });
        }
        else{
            res.status(403).json({
                msg:"Incorrect password entered"
            });
        }
    }
    catch(error){
        res.status(500).json({
            msg:"Unable to signin",
            error: error
        });
    }
})

//api to generate a new access token
router.post("/refresh",function(req,res){
    const refreshToken= req.cookies.refreshtoken;  //get the refresh token from the cookies
    console.log(refreshToken);
    if(!refreshToken){
        return res.status(401).json({
            msg:"Refresh token not in cookie"
        });
    }
    else{
        try{
            const decoded= jwt.verify(refreshToken,refresh_secret);
            const new_access= gentoken.genaccess(decoded.username);
            res.status(200).json({
                msg:"Successfully created the access token",
                accesstoken: new_access
            })
        }catch{
           res.status(403).json({
            msg:"Incorrect refreshtoken"
           });
        }
    }
})

module.exports= router;