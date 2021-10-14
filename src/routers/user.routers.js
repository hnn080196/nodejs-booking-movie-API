const express = require("express");
const {
  getAllUser,
  getUserInfo,
  addNewUser,
  updateUser,
  removeUser,
  uploadAvatar,
  getMovieByUser,
} = require("../controllers/user.controller");
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middlewares");
const { logsUser } = require("../middlewares/logs/logs-user.middlewares");
const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middlewares");
const {
  checkEmptyUser,
} = require("../middlewares/validations/check-empty.middleware");
const {
  checkExist,
} = require("../middlewares/validations/check-exist.middlewares");
const { User } = require("../models");

/**
 * tạo api quản lý người dùng ( REST APIS )
 *      1/ lấy danh sách người dùng ( get - http://localhost:9000/users )
 *      2/ lấy chi tiết người dùng ( get - http://localhost:9000/users/12 )
 *      3/ tạo người dùng ( post - http://localhost:9000/users )
 *      4/ cập nhật người dùng ( put - http://localhost:9000/users/12 )
 *      5/ xóa người dùng ( delete - http://localhost:9000/users/12 )
 */

const userRouter = express.Router();

userRouter.post(
  "/upload-avatar",
  authenticate,
  uploadImageSingle("avatar"),
  uploadAvatar
);

userRouter.get("/", logsUser, getAllUser);

userRouter.get("/:id", checkExist(User), getUserInfo);

userRouter.post("/", checkEmptyUser, addNewUser);

userRouter.put("/:id", checkExist(User), updateUser);

userRouter.delete(
  "/:id",
  authenticate,
  authorize(["admin", "superadmin"]),
  checkExist(User),
  removeUser
);
userRouter.get("/movie-by-user/:id", authenticate, getMovieByUser);
module.exports = {
  userRouter,
};
