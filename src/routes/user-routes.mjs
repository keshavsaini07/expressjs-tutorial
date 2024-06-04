import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { users } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../middlewares/user-middleares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be atleast 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // filtering data : when filter and value are defined
    let parsedSalary = parseInt(value);
    if (filter && value) {
      return res.send(users.filter((user) => user[filter] === parsedSalary));
    }
    // doesn't do any filtering
    return res.send(users);
  }
);

router.get("/api/users/:id", resolveIndexByUserId  , (req, res) => {
  const { findUserIndex } = req;
  const findUser = users[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
    const data = matchedData(req);
    console.log(data);
    const newUser = { id: users[users.length - 1].id + 1, ...data };
    users.push(newUser);
    console.log(newUser);
    res.status(201).send("User Created");
  }
);

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  // taking the existing user, putting it into a new object and after this overriding the key-value pairs in this object with key-value pairs within the request body
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return res.status(200).send("User Updated");
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return res.status(200).send("User Updated");
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  users.splice(findUserIndex, 1);
  return res.status(200).send("User Deleted");
});

export default router;
