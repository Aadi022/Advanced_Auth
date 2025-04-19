//authenticating the request that comes back from google
const express = require("express");
const router  = express.Router();
const dotenv  = require("dotenv");
dotenv.config();  //loads env variables to process.env
const { OAuth2Client } = require("google-auth-library");

async function getUserData(access_token){   //This aasynchronous function will fetch the user's google account
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();  //parses the response body to json
  console.log('data', data);
}

router.get('/', async function(req, res, next){
  const code = req.query.code;
  try{  //Grabs the OAuth “authorization code” that Google redirected back to you with.
    const redirectUrl = 'http://127.0.0.1:3000/oauth';
    const oauth2Client = new OAuth2Client(   //Instantiates a new oAuthClient client
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const { tokens } = await oauth2Client.getToken(code);  //exchanges authorization code for tokens(Here we get the access and refresh tokens)
    await oauth2Client.setCredentials(tokens);            //Client can use the tokens for future request
    console.log("Tokens acquired");

    const user = oauth2Client.credentials;   //Getting the user credentials 
    console.log('credentials', user);

    await getUserData(user.access_token);
    res.send("Google sign-in successful");
  }
  catch(err){
    console.log("Error with signing in with Google");
    res.status(500).send("Authentication error");
  }
});

module.exports = router;
