const express = require("express");
const router = express.Router();

const _ = require("lodash");

const validation = require("../middleware/validation");
const auth = require("../middleware/auth");

const { User, userValidation } = require("../models/user");

router.post("/", validation(userValidation), async (req, res) => {
  const { name, email, password } = req.body;

  const registeredUser = await User.findOne({ email });
  if (registeredUser)
    return res.status(400).send("This email has already been registered.");

  const user = new User({ name, email });

  await user.setPassword(password);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

// FIXME: Perhaps change approach

router.get("/me", auth, async (req, res) => {
  const { _id: userId } = req.user;

  const user = await User.findById(userId).select("-password");

  res.send(user);
});

module.exports = router;
