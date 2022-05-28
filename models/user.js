const mongoose = require("mongoose");
const HttpError = require("../errors/HttpError");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Model - Mongoose

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    email: {
      // FIXME: alter min & max lengths?
      type: String,
      minlength: 6,
      maxlength: 50,
      unique: true,
      required: true,
    },
    password: {
      // FIXME: alter min & max length?
      type: String,
      minlength: 8,
      maxlength: 72, // bcrypt creates a hash of max 72 BYTES
      required: true,
      set: (v) => v,
    },
  },
  { timestamps: true } // sets createdAt and updatedAt automatically
);

userSchema.methods.generateAuthToken = function () {
  const key = process.env.JWTKEY;
  const token = jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    key
  );

  return token;
};

userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.checkRegistered = async function (email) {
  const registeredUser = await this.findOne({ email });
  if (registeredUser)
    throw new HttpError({
      statusCode: 400,
      message: "This email has already been registered.",
    });
};

userSchema.statics.checkLogin = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user)
    throw new HttpError({
      statusCode: 400,
      message: "Invalid Email or Password!",
    });

  const valid = await user.validatePassword(password);
  if (!valid)
    throw new HttpError({
      statusCode: 400,
      message: "Invalid Email or Password!",
    });

  return user;
};

userSchema.statics.createUser = async function (name, email, password) {
  const user = new this({ name, email });

  await user.setPassword(password);
  await user.save();

  return user;
};

userSchema.statics.findUserById = async function (userId) {
  return await this.findById(userId).select("-password");
};

const User = mongoose.model("User", userSchema);

// Validation - Joi

const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 3,
};

const validationSchema = {
  // FIXME: implement email validation?
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().min(6).max(50).required(),
  password: passwordComplexity(complexityOptions, "Password").required(),
};

function userValidation(user) {
  const schema = Joi.object(validationSchema);
  return schema.validate(user);
}

exports.User = User;
exports.userValidation = userValidation;
