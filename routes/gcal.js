const express = require("express");
const router = express.Router();

const googleApi = require("../middleware/googleApi");
const validation = require("../middleware/validation");

const {
  storeRefreshToken,
  revokeRefreshToken,
  createEvent,
  getTaskItEvents,
  deleteEvent,
  updateEvent,
} = require("../helpers/google");
const { gcalEventValidation } = require("../models/gcalEvent");

router.post("/authorize", async (req, res) => {
  const { _id: userId } = req.user;
  const { code } = req.body;

  await storeRefreshToken(code, userId);

  res.send("User Authorized");
});

router.post("/unauthorize", async (req, res) => {
  const { _id: userId } = req.user;

  await revokeRefreshToken(userId);

  res.send("User Authorization Revoked");
});

router.post(
  "/",
  [googleApi, validation(gcalEventValidation)],
  async (req, res) => {
    const { refreshToken } = req.user;
    const eventBody = req.body;

    const { data } = await createEvent(refreshToken, eventBody);

    res.send(data);
  }
);

router.get("/", googleApi, async (req, res) => {
  const { refreshToken } = req.user;

  const { data } = await getTaskItEvents(refreshToken);

  res.send(data);
});

router.put(
  "/:id",
  [googleApi, validation(gcalEventValidation)],
  async (req, res) => {
    const { refreshToken } = req.user;
    const eventBody = req.body;
    const { id: eventId } = req.params;

    const { data } = await updateEvent(refreshToken, eventBody, eventId);
    res.send(data);
  }
);

router.delete("/:id", googleApi, async (req, res) => {
  const { refreshToken } = req.user;
  const { id: eventId } = req.params;

  const { data } = await deleteEvent(refreshToken, eventId);

  res.send(data);
});

module.exports = router;
