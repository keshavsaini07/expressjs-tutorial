import { users } from "../utils/constants.js";

export const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ masg: "Bad Request! Invalid Id" });
  }
  const findUserIndex = users.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};
