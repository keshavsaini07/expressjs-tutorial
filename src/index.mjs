import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
// import "./utils/strategy/local-strategy.mjs"
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./utils/strategy/discord-strategy.mjs"

const app = express();

mongoose
  .connect("mongodb://127.0.0.1/express-tutorial")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("anything"));
app.use(session({
  secret: "void",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/api/auth/status", (req, res) => {
  console.log("Inside auth status");
  console.log(req.user);
  return req.user
    ? res.send(req.user)
    : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get("/api/auth/discord/redirect", passport.authenticate("discord"), (req, res) => {
  console.log("1 - Inside auth discord")
  console.log(req.session);
  console.log(req.user)
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});

 
