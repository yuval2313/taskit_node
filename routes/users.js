const express = require("express");
const router = express.Router();

const { User } = require("../models/user");

router.get("/me", async (req, res) => {
  const { _id: userId } = req.user;

  const user = await User.findUserById(userId);

  res.send(user);
});

module.exports = router;
