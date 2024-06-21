import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../../mongoose/models/discord-user.mjs";

passport.serializeUser((user, done) => {
  console.log("3 - Inside Serialize user", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("4 - Inside Deserialize user", id);
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(error, null);
  } 
});

export default passport.use(
  new Strategy(
    {
      clientID: "1253759135581995009",
      clientSecret: "TMZyHVgXB17ER_0vgUOVO5ZAslw_xvNb",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("2 - Inside Strategy")
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (error) {
        return done(error, null);
      }
      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser)
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error)
        return done(error, null)
      }
    }
  )
);

