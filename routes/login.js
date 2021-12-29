const express = require("express");
const router = express.Router();

const Joi = require("joi");

const validation = require("../middleware/validation");

const { User } = require("../models/user");

router.post("/", validation(loginValidation), async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid Email or Password!");

  const valid = await user.validatePassword(password);
  if (!valid) return res.status(400).send("Invalid Email or Password!");

  const token = user.generateAuthToken();
  res.send(token);
});

// Validation - Joi

const loginSchema = {
  email: Joi.string().email().min(6).max(50).required(),
  password: Joi.string().min(8).max(50).required(),
};

function loginValidation(user) {
  const schema = Joi.object(loginSchema);
  return schema.validate(user);
}

module.exports = router;
