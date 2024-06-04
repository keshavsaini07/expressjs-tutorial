import express from "express";
import usersRouter from "./routes/user-routes.mjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(usersRouter)

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
