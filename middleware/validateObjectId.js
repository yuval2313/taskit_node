const mongoose = require("mongoose");
const HttpError = require("../errors/HttpError");

module.exports = function (req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new HttpError({
      statusCode: 400,
      message: "Invalid ID as route parameter",
    });

  next();
};
