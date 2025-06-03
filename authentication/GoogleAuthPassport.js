import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import passport from "passport";
import User from "../models/user.models.js";
import { generateRandomName, generateRandomPassword } from "../utilits/functionalHandler.js";


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},

    async function (accessToken, refreshToken, profile, done) {
     
        const generatedUsername = generateRandomName()
        const generatedPassword = generateRandomPassword()


        try {
            const user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                return done(null, user);
            }


            const newUser = await User.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                username: generatedUsername,
                password: generatedPassword,
                email: profile.emails[0].value,
                profilePicture: {
                    googleImageUrl: profile.photos[0].value,
                }
            })

            return done(null, newUser);


        } catch (error) {
            console.log(error)
            
        }


    }
));

export default passport