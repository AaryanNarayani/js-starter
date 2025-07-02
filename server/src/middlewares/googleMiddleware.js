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
               const googleAvatar = profile.photos?.[0]?.value;

               if (!googleEmail) {
                   throw new Error("No email provided from Google");
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
