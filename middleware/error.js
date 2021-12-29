module.exports = function (err, req, res, next) {
  console.log("Error:", err);
  res.status(500).send("Something Failed!");
};
