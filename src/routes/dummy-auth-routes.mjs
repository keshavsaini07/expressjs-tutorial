import { Router } from "express";

const router = Router();

router.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = users.find((user) => user.username === username);
  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "BAD CREDENTAILS!" });
  }

  req.session.user = findUser;

  res.status(200).send(findUser);
});

router.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    console.log(sessionData);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
});

router.post("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ msg: "UNAUTHORIZED ACTION " });
  }
  // assuming all values in request body are valid
  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  res.status(200).send(item);
});

router.get("/api/cart", (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session.cart ?? [])
    : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
});

export default router;
