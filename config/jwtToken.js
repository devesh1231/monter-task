const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateJWTToken(userId) {
  console.log(process.env.SECRET_KEY)
  const token = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return token;
}

module.exports = { generateJWTToken };
