const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const bcrypt = require("bcryptjs");

const User = require("../model/User");

const Profile = require("../model/Profile");


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                "https://edtech-mega-project.onrender.com/api/v1/auth/google/callback",

            passReqToCallback: true,
        },

        async (
            req,
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                const email = profile.emails[0].value;

                // Find existing user
                let existingUser = await User.findOne({
                    email,
                });

                // Get role from session
                const accountType =
                    req.session.accountType;

                // VALIDATION
                if (
                    accountType !== "Student" &&
                    accountType !== "Instructor"
                ) {
                    return done(
                        new Error("Invalid account type"),
                        null
                    );
                }

                // EXISTING USER
                if (existingUser) {

                    // Prevent role mismatch
                    if (
                        existingUser.accountType !==
                        accountType
                    ) {
                        return done(
                            new Error(
                                `Account already exists as ${existingUser.accountType}`
                            ),
                            null
                        );
                    }

                    return done(null, existingUser);
                }

                // CREATE PROFILE FIRST
                const profileDetails =
                    await Profile.create({

                        gender: null,

                        dateOfBirth: null,

                        about: "",

                        contactNumber: "",
                    });

                // Random password
                const randomPassword =
                    Math.random()
                        .toString(36)
                        .slice(-10);

                const hashedPassword =
                    await bcrypt.hash(
                        randomPassword,
                        10
                    );

                // Split Google name
                const nameArray =
                    profile.displayName.split(" ");

                const firstName =
                    nameArray[0] || "";

                const lastName =
                    nameArray.slice(1).join(" ") || "";

                // CREATE USER
                const newUser =
                    await User.create({

                        firstName,

                        lastName,

                        email,

                        password: hashedPassword,

                        accountType,

                        additionalDetail:
                            profileDetails._id,

                        image:
                            profile.photos[0]?.value ||
                            "",
                    });

                return done(null, newUser);

            } catch (error) {

                console.log(
                    "Google Strategy Error:",
                    error
                );

                return done(error, null);
            }
        }
    )
);


// Serialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// Deserialize
passport.deserializeUser(async (id, done) => {

    try {

        const user =
            await User.findById(id);

        done(null, user);

    } catch (error) {

        done(error, null);
    }
});


module.exports = passport;