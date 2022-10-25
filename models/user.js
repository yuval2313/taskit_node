const mongoose = require("mongoose");

// Model - Mongoose

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      required: true,
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

userSchema.statics.findUserById = async function (userId) {
  return await this.findById(userId);
};

const User = mongoose.model("User", userSchema);

exports.User = User;
