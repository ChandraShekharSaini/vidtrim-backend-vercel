import { Strategy as InstagramStrategy } from "passport-instagram";
import User from "../models/user.models.js";
import passport from "passport";
import {
  generateRandomName,
  generateRandomPassword,
} from "../utilits/functionalHandler.js";

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
    },

    async function (accessToken, refreshToken, profile, done) {
      const generatedUsername = generateRandomName();
      const generatedPassword = generateRandomPassword();

      try {

        console.log("-----------------------------profile-----------------------------");
        console.log(user);
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
          },
        });

        return done(null, newUser);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

export default passport;
