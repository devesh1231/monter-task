const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  emailOtp: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  location: {
    type: String,
  },
  age: {
    type: Number,
  },
  workDetails: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
