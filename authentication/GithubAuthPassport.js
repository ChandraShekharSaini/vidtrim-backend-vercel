import { Strategy as GitHubStrategy } from "passport-github2"
import passport from "passport"
import User from "../models/user.models.js"
import { generateRandomName, generateRandomPassword } from "../utilits/functionalHandler.js"
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
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
                firstName: profile.name.displayName,
                username: generatedUsername,
                password: generatedPassword,
                email: profile.emails[0].value,
                profilePicture: {
                    githubImageUrl: profile.photos[0].value,
                }
            })

            return done(null, newUser);




        } catch (error) {
            console.log(error)
        }


    }
));


export default passport