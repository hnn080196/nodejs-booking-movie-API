const jwt = require("jsonwebtoken");

const generateToken = (id, email, role) => {
  const payload = {
    id,
    email,
    role,
  };
  const secretKey = "nodejs-sang-01";
  const token = jwt.sign(payload, secretKey, {
    expiresIn: 3 * 30 * 24 * 60 * 60, // giây
  });
  return token;
};

module.exports = {
  generateToken,
};
