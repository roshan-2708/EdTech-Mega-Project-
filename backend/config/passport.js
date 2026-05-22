const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    try {

      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {

        return done(null, user);
      } else {

        user = await User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          accountType: "Student",
          image: profile.photos[0].value,
          approved: true,
        });
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));