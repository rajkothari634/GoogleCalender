const { google } = require("googleapis");
const express = require("express");
const ac = require("./authController");
const OAuth2Data = require("./google-key.json");
const path = require("path");

const app = express();

// const CLIENT_ID = OAuth2Data.client.id;
// const CLIENT_SECRET = OAuth2Data.client.secret;
// const REDIRECT_URL = OAuth2Data.client.redirect;

app.get("/login", ac.sendLink);
app.get("/auth/google/callback", ac.saveUser);

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
//         const oauth2 = google.oauth2({ version: "v2" });
//         oauth2.userinfo
//           .get()
//           .then((userData) => {
//             console.log(userData);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//         res.redirect("/");
//       }
//     });
//   }
// });

//// oAuth2Client.getToken(code).then(res => {
////     const tokens = res.tokens;
////     oAuth2Client.setCredentials(tokens);
////     const oauth2 = google.oauth2({ version: 'v2' });
////     return oauth2.userinfo.get();
//// })
////     .then(userData => {
////         console.log(userData);
////         authed = true;
////     })
////     .catch(err => {
////         console.log(err);
////     });

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/saveUser", ac.saveUser);

const port = 5000;
app.listen(port, () => console.log(`Server running at ${port}`));
