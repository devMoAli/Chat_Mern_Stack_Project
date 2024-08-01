const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
        url: {
          type: String,
          default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
        },
        publicId: {
          type: String,
          default: null
        }
      },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Match Password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Joi schema for validating registration data
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

// Joi schema for validating login data
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

// Joi schema for validating update data
function validateUpdateUser(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    password: passwordComplexity(),
  });
  return schema.validate(obj);
}

// Joi schema for validating email
function validateEmail(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
  });
  return schema.validate(obj);
}

// Joi schema for validating new password
function validateNewPassword(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateEmail,
  validateNewPassword,
};
