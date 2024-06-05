import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("anything"));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.cookie("cookkie", "hello world", { maxAge: 60000, signed: true }  )
  res.status(201).send({ msg: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
