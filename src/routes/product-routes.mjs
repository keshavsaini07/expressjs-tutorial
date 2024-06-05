import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies.cookkie)
  if (req.signedCookies.cookkie && req.signedCookies.cookkie === "hello world")
    return res.send([{ id: 101, name: "Dosa", price: 60 }]);

  return res.status(403).send({msg: "Sorry! Please retry with a correct cookie."})
});

export default router;