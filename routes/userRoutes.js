const express = require('express');
const router = express.Router();
const { register, otpVerification, updateUserDetails } = require('../controllers/userController');


router.post('/register', register);
router.put('/otpVerification', otpVerification);
router.put('/updateUserDetails/:id', updateUserDetails);

module.exports = router;
