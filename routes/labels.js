const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");

const { Label, labelValidation } = require("../models/label");

router.get("/", async (req, res) => {
  const { _id: userId } = req.user;

  const labels = await Label.findUserLabels(userId);

  return res.send(labels);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: labelId } = req.params;

  const label = await Label.findLabelById(labelId, userId);

  return res.send(label);
});

router.post("/", validation(labelValidation), async (req, res) => {
  const { _id: userId } = req.user;

  const label = await Label.create({ ...req.body, userId });

  return res.send(label);
});

router.put(
  "/:id",
  [validateObjectId, validation(labelValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: labelId } = req.params;

    const label = await Label.updateLabel(labelId, userId, req.body);

    return res.send(label);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: labelId } = req.params;

  const label = await Label.deleteLabel(labelId, userId);

  return res.send(label);
});

module.exports = router;
