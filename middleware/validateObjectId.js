const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Invalid ID as route parameter");

  next();
};
