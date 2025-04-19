const express= require("express");
const app= express();
const cors= require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const port= process.env.PORT;
const mainroute= require("./routes/routes.js");
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your client URL
    credentials: true
}));

app.use(cookieParser());  // Parsing the cookies, required when generating access token using the refresh token

app.use(bodyParser.json());

app.use(mainroute);

app.listen(port,function(){
    console.log("The server is running on port ",port);
})