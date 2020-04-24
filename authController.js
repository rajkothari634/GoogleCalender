// const { google } = require("googleapis");
// const express = require("express");
// const OAuth2Data = require("./google_key.json");

// const app = express();

// const CLIENT_ID = OAuth2Data.client.id;
// const CLIENT_SECRET = OAuth2Data.client.secret;
// const REDIRECT_URL = OAuth2Data.client.redirect;

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );
// var authed = false;

// app.get("/", (req, res) => {
//   if (!authed) {
//     // Generate an OAuth URL and redirect there
//     const url = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: "https://www.googleapis.com/auth/gmail.readonly",
//     });
//     console.log(url);
//     res.redirect(url);
//   } else {
//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
//     gmail.users.labels.list(
//       {
//         userId: "me",
//       },
//       (err, res) => {
//         if (err) return console.log("The API returned an error: " + err);
//         const labels = res.data.labels;
//         if (labels.length) {
//           console.log("Labels:");
//           labels.forEach((label) => {
//             console.log(`- ${label.name}`);
//           });
//         } else {
//           console.log("No labels found.");
//         }
//       }
//     );
//     res.send("Logged in");
//   }
// });

// app.get("/auth/google/callback", function (req, res) {
//   const code = req.query.code;
//   if (code) {
//     // Get an access token based on our OAuth code
//     oAuth2Client.getToken(code, function (err, tokens) {
//       if (err) {
//         console.log("Error authenticating");
//         console.log(err);
//       } else {
//         console.log("Successfully authenticated");
//         oAuth2Client.setCredentials(tokens);
//         authed = true;
//         res.redirect("/");
//       }
//     });
//   }
// });

// const port = process.env.port || 5000;
// app.listen(port, () => console.log(`Server running at ${port}`));

const { google } = require("googleapis");
const OAuth2Data = require("./google-key.json");
const fs = require("fs");

const https = require("https");

var users = JSON.parse(fs.readFileSync("./user-data.json"));
const googleConfig = {
  clientId: OAuth2Data.client.id,
  clientSecret: OAuth2Data.client.secret,
  redirect: OAuth2Data.client.redirect,
};
/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}
// function getClientId() {
//   console.log(googleConfig.clientId);
//   return googleConfig.clientId;
// }
/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/userinfo.email",
];

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  });
}

/**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}

exports.sendLink = async (req, res, next) => {
  try {
    const link = await urlGoogle();
    //const s = signinLink.split("&");

    // console.log(s[5]);
    // console.log("raj" + OAuth2Data.web.clientId);
    // const link =
    //   s[0] +
    //   "&" +
    //   s[1] +
    //   "&" +
    //   s[2] +
    //   "&" +
    //   s[3] +
    //   "&" +
    //   s[4] +
    //   "285404437660-u6lto717vhog7h4aivada8pt77d5t956.apps.googleusercontent.com" +
    //   "&" +
    //   s[5];
    //console.log("raj" + signinLink);
    res.status(200).json({
      status: "success",
      responseText: link,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      responseText: err,
    });
  }
};

/**
 * Helper function to get the library with access to the google plus api.
 */
async function getGoogleApi(auth) {
  const me = await plus.people.get({ userId: "me" });
  return me;
}

async function getGoogleAccountFromCode(code) {
  try {
    const auth = createConnection();
    const data = await auth.getToken(code);
    console.log("rtt");
    const tokens = data.tokens;
    auth.setCredentials(tokens);
    const plus = getGoogleApi(auth);
    const me = await plus.people.get({ userId: "me" });
    const userGoogleId = me.data.id;
    const userGoogleEmail =
      me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      responseText: err,
    });
  }
}

exports.saveUser = async (req, res, next) => {
  try {
    const code = req.url.split("?")[1].substring("5");
    console.log("raj1");
    console.log(code);
    console.log(req.url);

    const userdata = await getGoogleAccountFromCode(code);
    console.log("raj2");
    let user = {
      id: userdata.id,
      emailid: userdata.email,
      token: userdata.tokens,
      token_time: "120000",
    };
    console.log("raj3");
    users.push(user);
    console.log("raj4");
    fs.writeFile("./user-data.json", JSON.stringify(users));
    console.log("raj5");
    res.sendFile(path.join(__dirname + "/calender.html"));
  } catch (err) {
    res.status(400).json({
      status: "faillll",
      responseText: err,
    });
  }
};
