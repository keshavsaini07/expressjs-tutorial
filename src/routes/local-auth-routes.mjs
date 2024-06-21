import passport from "passport";
// import "./utils/strategy/local-strategy.mjs"
import "../utils/strategy/local-strategy.mjs"

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  console.log("1 - inside auth");
  res.status(200).send({ msg: "User Login Success" });
});

app.post("/api/auth/logout", (req, res) => {
  return req.user
    ? req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.status(200).send("User Logged Out");
      })
    : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
});

app.get("/api/auth/status", (req, res) => {
  console.log("Inside auth status");
  console.log(req.user);
  return req.user
    ? res.send(req.user)
    : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
});
