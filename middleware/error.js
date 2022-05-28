module.exports = function (err, req, res, next) {
  if (err.name === "HttpError")
    return res.status(err.statusCode).send(err.message);
  else return res.status(500).send("Something Failed!");
};
