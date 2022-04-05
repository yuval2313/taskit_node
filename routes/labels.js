const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");

const { Label, labelValidation } = require("../models/label");
const { Task } = require("../models/task");

router.get("/", async (req, res) => {
  const { _id: userId } = req.user;

  const labels = await Label.find({ userId });

  if (!labels || labels.length === 0)
    return res.status(404).send("No labels found for current user");

  return res.send(labels);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: labelId } = req.params;

  const label = await Label.findOne({ userId, _id: labelId });

  if (!label) return res.status(404).send("Label with the given id not found");

  return res.send(label);
});

router.post("/", validation(labelValidation), async (req, res) => {
  const { _id: userId } = req.user;

  const label = new Label({ ...req.body, userId });

  await label.save();

  return res.send(label);
});

router.put(
  "/:id",
  [validateObjectId, validation(labelValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: labelId } = req.params;

    const session = await mongoose.connection.startSession();
    session.startTransaction();

    const label = await Label.findOneAndUpdate(
      { userId, _id: labelId },
      req.body,
      {
        new: true,
        session,
      }
    );

    if (!label) {
      await session.abortTransaction();
      return res.status(404).send("Label with the given ID was not found.");
    }

    await Task.updateMany(
      {
        labels: {
          $elemMatch: {
            _id: labelId,
          },
        },
        userId,
      },
      {
        $set: {
          "labels.$.name": label.name,
        },
      },
      { session }
    );

    await session.commitTransaction();

    session.endSession();

    return res.send(label);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: labelId } = req.params;

  const session = await mongoose.connection.startSession();
  session.startTransaction();

  const label = await Label.findOneAndDelete(
    { userId, _id: labelId },
    { session }
  );

  if (!label) {
    await session.abortTransaction();
    return res.status(404).send("Label with the given id not found");
  }

  await Task.updateMany(
    {
      labels: {
        $elemMatch: {
          _id: labelId,
        },
      },
      userId,
    },
    {
      $pull: {
        labels: {
          _id: labelId,
        },
      },
    },
    { session }
  );

  await session.commitTransaction();

  session.endSession();

  return res.send(label);
});

module.exports = router;
