//This will generate the auth url. It will ping google for signin and then redirect
const express = require("express");
const router  = express.Router();
const dotenv  = require("dotenv");
dotenv.config();  //loads env variables to process.env
const { OAuth2Client } = require("google-auth-library");

//When we ping this route from our frontend, it will generate a url and send it back to frontend, and ping that url from frontend
router.post("/", async function(req, res, next) {
  res.header('Access-Control-Allow-Origin','http://localhost:5173');  //Make sure we are not blocked by cors
  res.header('Referrer-Policy','no-referrer-when-downgrade');        //This is required as we are using http and not https

  const redirectUrl = 'http://127.0.0.1:3000/oauth';  //After signin, we will get redirected to here

  //Now we will be firing the oauth2client
  const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  //Now we will use OAuth2Client to generate the url to ping google with
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',   //This will force a refresh token to be generated and returned
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',  //Requests permission to read the user’s basic profile (userinfo.profile)
      'openid'                                              //and their OpenID Connect ID (openid).
    ],
    prompt: 'consent'  //forces google to show the consent screen on every signin
  });

  res.status(200).json({
    url: authorizeUrl  //returning the oauth url
  });
});

module.exports = router;
//userinfo.profile → lets you fetch basic profile fields via Google’s REST API.
//openid → lets you receive an ID token right in your OAuth exchange, so you can verify the user’s identity on your backend.
