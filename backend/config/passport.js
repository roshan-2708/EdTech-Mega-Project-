const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://edtech-mega-project.onrender.com/api/v1/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || !profile.emails[0]) {
        return done(new Error("No email found in Google profile"), null);
      }

      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, user);
      } else {
        const newUserProps = {
          firstName: profile.name?.givenName || "Google",
          lastName: profile.name?.familyName || "User",
          email: profile.emails[0].value,
          accountType: "Student",
          image: profile.photos?.[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${profile.name?.givenName}`,
          approved: true,
        };

        user = await User.create(newUserProps);
        return done(null, user);
      }
    } catch (error) {
      console.error("❌ Passport Google Auth Error Details:", error); 
      return done(error, null);
    }
  }
));