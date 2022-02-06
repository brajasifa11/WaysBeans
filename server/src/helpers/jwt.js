const jwt = require('jsonwebtoken');
const secretKey = 'waysbeans';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secretKey
  );
};

const verifyToken = (access_token) => {
  return jwt.verify(access_token, secretKey)
};

module.exports = { generateToken, verifyToken };