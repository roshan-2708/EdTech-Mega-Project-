const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../model/User'); // your DB model

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,           // lets us read req.session in the strategy
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await db.findOne({ email });

    if (!user) {
      // New user — grab the role we stored in session before OAuth started
      const role = req.session.pending_role || 'student';
      user = await db.create({
        email,
        name:      profile.displayName,
        google_id: profile.id,
        role,              // ← saved here, never asked again
      });
      req.session.pending_role = null;  // clean up
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await db.findById(id);
  done(null, user);
});