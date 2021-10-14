const logsUser = (req, res, next) => {
  console.log("đây là tính năng lấy danh sách người dùng");
  next(); // chạy tới các middleware hoặc controller tiếp theo
};

module.exports = {
  logsUser,
};
