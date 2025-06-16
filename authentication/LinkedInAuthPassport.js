import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import passport from "passport";

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_API_KEY,
      clientSecret: process.env.LINKEDIN_SECRET_KEY,
      callbackURL: process.env.LINKEDIN_CALLBACK,
      scope: ['r_liteprofile'], // Add scope here or in route
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("LinkedIn profile:", profile);
      return done(null, profile);
    }
  )
);


export default passport;
