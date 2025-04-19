const express= require("express");
const router= express.Router();
const authroute= require("../controllers/auth.js");

router.use("/auth",authroute);

module.exports= router;