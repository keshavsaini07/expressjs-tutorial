import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { users } from "./utils/constants.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("anything"));
app.use(session({
  secret: "void",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie("cookkie", "hello world", { maxAge: 60000, signed: true }  )
  res.status(201).send({ msg: "Hello World" });
});

app.post("/api/auth", (req, res) => {
  const { body: { username, password } } = req;
  const findUser = users.find( (user) => user.username === username);
  if(!findUser || findUser.password !== password){
    return res.status(401).send({msg: "BAD CREDENTAILS!"})
  }

  req.session.user = findUser;

  res.status(200).send(findUser);
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
