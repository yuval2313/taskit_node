const mongoose = require("mongoose");
//TODO: use logger

module.exports = function () {
  const dbUrl = process.env.DBURL;
  mongoose
    .connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(`Connected to ${dbUrl} Successfully!`);
    });
};
