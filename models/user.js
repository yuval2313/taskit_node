const mongoose = require("mongoose");

// Model - Mongoose

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.findUserByGoogleId = async function (googleId) {
  return await this.findOne({ googleId });
};

const User = mongoose.model("User", userSchema);

exports.User = User;
