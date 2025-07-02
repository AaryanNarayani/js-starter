const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require('jsonwebtoken');
const passport = require('passport');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET is not defined in environment variables');
}

passport.use(
   new GoogleStrategy(
       {
           clientID: process.env.CLIENT_ID,
           clientSecret: process.env.CLIENT_SECRET,
           callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
           scope: ["profile", "email"]
       },
       async function (
           _accessToken, 
           _refreshToken, 
           profile, 
           callback
       ) {
           try {
               const googleEmail = profile.emails?.[0].value;
               let googleAvatar = profile.photos?.[0]?.value;

               if (!googleEmail) {
                   throw new Error("No email provided from Google");
               }

               // Create a user object with a random ID and the email and avatar from Google
               // In a real application, you would typically check if the user already exists in your database
               // and create a new user if not, or update the existing user with the new information
               // Here, we are simulating this with a random ID for demonstration purposes

               if(!googleAvatar){
                    googleAvatar = "https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico";
               }
               const user = { id: Math.random(), email: googleEmail , avatar: googleAvatar };

               const token = jwt.sign(
                   { id: user.id, email: user.email, avatar: user.avatar }, 
                   String(JWT_SECRET),
                   { expiresIn: "3h" }
               );

               callback(null, { ...user, token });
           } catch (error) {
               console.error("Error in Google Strategy:", error);
               callback(error);
           }
       }
   )
);

passport.serializeUser((user, done) => {
   done(null, user);
});

passport.deserializeUser((user, done) => {
   done(null, user);
});
