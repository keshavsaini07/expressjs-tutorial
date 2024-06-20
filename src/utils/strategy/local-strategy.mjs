import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../constants.js";
import { User } from "../../mongoose/models/user.mjs";
import { comparePassword } from "../helpers.mjs";

// when a user logs in this serializeUser function needs to be called, and the user will log in once until they logs out
passport.serializeUser((user, done) => {
    console.log("3 - Inside Serialize user", user)
    done(null, user.id);
})

// once we have logged in, any request that we make later on, then passport will call the deserializeUser function, also checking for valid user
passport.deserializeUser(async (id, done) => {
    console.log("4 - Inside Deserialize user", id)
   try {
     const findUser = await User.findById(id);
     if (!findUser) {
       throw new Error("User not found");
     }
     done(null, findUser);
   } catch (error) {
     done(error, null);
   }
})

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log("2 - inside local strategy");
    console.log(`username: ${username}, password: ${password}`)
    // validate the user and do many other things
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) { 
        throw new Error("User not found");
      }
      if (!comparePassword(password, findUser.password)) {
        throw new Error("Invalid Credentials"); 
      }
      // done(error-null, user-findUser) : if user found then pass it into done()
      done(null, findUser);
    } catch (error) {
      // done(error - error, user - null) : if any error persists we need to pass it to the done()
      done(error, null);
    }
  })
);

