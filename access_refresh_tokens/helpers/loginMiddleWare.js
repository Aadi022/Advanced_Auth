const admindb= require("../config/db.js");
const mongoose= require("mongoose");
const express= require("express");

//middleware to check if the 
async function loginmw(req,res,next){
    try{
        const body= req.body;
        const user= await admindb.Admin.findOne({
            Email: body.Email
        });
        if(user){
            req.user= user;
            next();
        }
        else{
            res.status(404).json({
                msg:"Email ID can't be found in the DB"
            });
        }
    }
    catch{
        res.status(500).json({
            msg:"Issue in the middleware in the server"
        });
    }

}

module.exports= loginmw;