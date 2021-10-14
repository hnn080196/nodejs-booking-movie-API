const jwt = require("jsonwebtoken");

// kiểm tra người dùng có đăng nhập hay chưa
const authenticate = (req, res, next) => {
  const token = req.header("token");
  try {
    const secretKey = "nodejs-sang-01";
    const decode = jwt.verify(token, secretKey);
    req.user = decode;
    console.log("pass-authenticate");

    next();
  } catch (error) {
    res.status(401).send({
      message: "Bạn Chưa Đăng Nhập",
    });
  }
};

// phân quyền người dùng
const authorize = (arrayRole) => (req, res, next) => {
  try {
    const { user } = req;
    if (arrayRole.includes(user.role)) {
      console.log("pass-authorize");
      next();
    } else {
      res.status(403).send({
        message: "Bạn không được phân quyền chức năng này",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  authenticate,
  authorize,
};
