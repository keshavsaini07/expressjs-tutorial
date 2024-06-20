import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { users } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/models/user.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be atleast 3-10 characters"),
  async (req, res) => {
    // console.log(req.session);
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
       if(err){
        console.log(err)
        throw err;
       }
       console.log(sessionData)
    });
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // filtering data : when filter and value are defined
    if (filter && value) {
      let query;
      if(filter === "salary"){
        let parsedSalary = parseInt(value);
        if(isNaN(parsedSalary)){
          res.status(401).send({ msg : "salary must be a numeric value" });
        }
        query = { [filter] : parsedSalary };
      }else{
        query = { [filter] : value };
      }
      const data = await User.find(query);
      return res.send(data);
    }
    // doesn't do any filtering
    const data = await User.find();
    return res.send(data);
  }
);

router.get("/api/users/:id", async (req, res) => {
  const { params : { id } } = req;
  const findUser = await User.findById(id);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
      res.status(400).send({ errors: result.array() });
    }
    const data = matchedData(req);
    console.log(data);

    const newUser = new User(data);

    try {
      const savedUser = await newUser.save(); 
      res.status(201).send(savedUser);
    } catch (error) {
      console.log(error);
      res.status(400).send("User Not Created");
    }
  }
);

router.patch("/api/users/:id", async (req, res) => {
  const { params: { id }, body } = req;
  const findUser = await User.findByIdAndUpdate(id, {$set : body});
  if (!findUser) return res.sendStatus(404).send("User Not Found");
  return res.status(200).send("User Updated");
});

router.put("/api/users/:id", async (req, res) => {
  const { params: { id }, body } = req;
  const findUser = await User.findByIdAndUpdate(id, body);
  if (!findUser) return res.sendStatus(404).send("User Not Found");
  return res.status(200).send("User Updated");
});

router.delete("/api/users/:id", async (req, res) => {
  const { params: { id } } = req;
  const findUser = await User.findByIdAndDelete(id);
  if (!findUser) return res.sendStatus(404).send("User Not Found");
  return res.status(200).send({
    msg: "User Deleted",
    user: findUser
  });
});

export default router;
