const express = require('express');
const router = express.Router();
const { register, otpVerification, updateUserDetails, login, getUserInfo } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken')

router.post('/register', register);
router.put('/otpVerification', otpVerification);
router.put('/updateUserDetails/:id', updateUserDetails);
router.put('/login', login);
router.get('/user', verifyToken, getUserInfo);
module.exports = router;
