const express = require("express");
const router = express.Router();

const googleApi = require("../middleware/googleApi");
const validation = require("../middleware/validation");

const { storeRefreshToken, createEvent } = require("../helpers/google");
const { gcalEventValidation } = require("../models/gcalEvent");

router.post("/authorize", async (req, res) => {
  const { _id: userId } = req.user;
  const { code } = req.body;

  await storeRefreshToken(code, userId);

  res.send("User Authorized");
});

router.post(
  "/create-event",
  [googleApi, validation(gcalEventValidation)],
  async (req, res) => {
    const { refreshToken } = req.user;
    const eventBody = req.body;

    const response = await createEvent(refreshToken, eventBody);

    res.send(response);
  }
);

module.exports = router;
