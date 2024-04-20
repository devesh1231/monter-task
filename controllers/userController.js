const User = require('../model/userModel.js');
const otpGenerator = require('otp-generator')
const { sendMail } = require('../util/nodeMailer.js')
const { generateJWTToken } = require('../config/jwtToken.js')
const bcrypt = require('bcrypt');
const register = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        data: "",
        message: 'your are already registered please login'
      });
    }
    else {
      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false, specialChars: false });
      const sendEMail = sendMail(process.env.AdminEmail, email, "OTP Verification", `Your OTP for account verification is: ${otp}.`);
      const newUser = new User({
        email,
        password,
        emailOtp: otp,
      });
      const savedUser = await newUser.save();
      res.status(201).json({
        status: true,
        data: savedUser,
        message: 'User registered successfully'
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: false,
      data: "",
      error: 'Internal Server Error'
    });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: "",
        message: "You are not registered"
      });
    }
    if (user.emailOtp === otp) {
      const updateUser = await User.findOneAndUpdate({ email: email }, { emailOtp: "", otpVerified: true }, { new: true });
      return res.status(201).json({
        status: true,
        data: updateUser,
        message: "OTP verified successfully"
      });
    } else {
      return res.status(500).json({
        status: false,
        data: "",
        message: "Incorrect OTP"
      });
    }
  } catch (error) {
    console.error("Error in otpVerification:", error);
    return res.status(500).json({
      status: false,
      data: "",
      message: "Internal Server Error"
    });
  }
};


const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, location, workDetails } = req.body;
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        status: false,
        data: "",
        message: "User not found"
      });
    }
    if (!user.otpVerified) {
      return res.status(400).json({
        status: false,
        data: "",
        message: "User is not verified"
      });
    }
    // Update user details
    const updateUser = await User.findByIdAndUpdate(
      id,
      { age: age, location: location, workDetails: workDetails },
      { new: true } // Return the updated user document
    );
    return res.status(201).json({
      status: true,
      data: updateUser,
      message: "User details updated successfully"
    });
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    return res.status(500).json({
      status: false,
      data: "",
      message: "Internal Server Error"
    });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: false,
        data: "",
        message: 'Invalid email or password'
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        data: "",
        message: 'Invalid email or password'
      });
    }
    const token = generateJWTToken(user._id);
    console.log(token)
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken: token },
      { new: true }
    );
    console.log(updateUser);
    res.json({
      status: true,
      data: updateUser,
      message: "login sucessfully"
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      status: false,
      data: "",
      message: 'Internal Server Error'
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        data: "", data: "",
        message: 'User not found'
      });
    }
    res.json({ data: user, message: "user fetched sucessfully" });
  } catch (error) {
    console.error('Error in fetching user information:', error);
    res.status(500).json({
      status: true,
      data: "",
      message: 'Internal Server Error'
    });
  }
};

module.exports = { register, otpVerification, updateUserDetails, login, getUserInfo }