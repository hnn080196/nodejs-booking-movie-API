const checkExist = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const detail = await Model.findByPk(id);
    if (detail) {
      req.detailInfo = detail;
      next();
    } else {
      res.status(404).send({
        message: "Model không tồn tại",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
// const checkExistEmail = (Model) => async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const checkEmail = await Model.findOne({
//       where: {
//         email: `${email}`,
//       },
//     });
//     if (checkEmail === null) {
//       next();
//     } else {
//       res.status(400).send("Email Đã Tồn Tại");
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: "Lỗi Server",
//     });
//   }
// };
module.exports = {
  checkExist,
};
