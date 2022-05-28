const express = require("express");
const router = express.Router();

const _ = require("lodash");

const validation = require("../middleware/validation");
const auth = require("../middleware/auth");

const { User, userValidation } = require("../models/user");

router.post("/", validation(userValidation), async (req, res) => {
  const { name, email, password } = req.body;

  await User.checkRegistered(email);

  const user = await User.createUser(name, email, password);

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/me", auth, async (req, res) => {
  const { _id: userId } = req.user;

  const user = await User.findUserById(userId);

  res.send(user);
});

module.exports = router;
