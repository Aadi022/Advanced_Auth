const express= require("express");
const app= express();
const dotenv= require("dotenv");
dotenv.config();
const port= process.env.PORT;
const myoauth= require("./oauth.js");
const myrequest= require("./request.js");

app.use("/oauth",myoauth);
app.use("/request",myrequest);


app.listen(port,function(){
    console.log("The sever is running on ",port);
})


/*
Process of google oauth-
You click “Sign in with Google.”

Your browser asks your server, “Hey, what link should I use to go log in with Google?”

The server builds that Google‑login link using your app’s ID and secret, and hands it back.

Your browser jumps to Google’s page. You pick your Google account and say “OK, I agree.”

Google sends your browser back to the server with a one‑time code.

The server takes that code and trades it with Google for a “token”—kind of like a backstage pass.

Using the token, the server asks Google, “Who is this person?” and Google replies with your name, picture, etc.

The server now knows who you are and can let you into the rest of the app.

*/

/*
IN MORE DETAIL

Click “Sign in with Google” in your React app → React sends a POST /request to your server.

Server (in request.js) uses your Client ID, Client Secret and redirect‑URI to build a Google OAuth URL and sends it back.

React immediately redirects the browser to that Google URL.

You log in at Google’s consent screen, and Google then redirects your browser to GET /oauth?code=XYZ on your server.

Server (in oauth.js) reads that one‑time code, calls getToken(code) to swap it for an access token (and, if you asked for access_type: 'offline', a refresh token).

Server can now use the access token to fetch your Google profile and optionally store the refresh token so you can quietly get a fresh access token later—keeping you “logged in.”


*/