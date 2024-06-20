import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./utils/strategy/local-strategy.mjs"
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

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

app.post("/api/auth", passport.authenticate('local'), (req, res) => {
  console.log("1 - inside auth")
  res.status(200).send({msg: "User Login Success"})
} )

app.post("/api/auth/logout", (req, res) => {
  return req.user ? req.logout((err) => {
    if(err) return res.sendStatus(400);
    res.status(200).send("User Logged Out")
  }) : res.status(401).send({msg: "UNAUTHORIZED ACTION"})
} )

app.get("/api/auth/status", (req, res) => {
  console.log("Inside auth status");
  console.log(req.user);
  return req.user ? res.send(req.user) : res.status(401).send({msg: "UNAUTHORIZED ACTION"})
})

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});

 