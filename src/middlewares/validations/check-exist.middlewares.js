const { ErrorHandler } = require('../../helpers/error');

const checkExist = (Model) => async (req, res, next) => {
    try {
        const { id } = req.params;
        const detail = await Model.findByPk(id);
        if (!detail) {
            throw new ErrorHandler(404, 'Dữ Liệu Không Tồn Tại.');
        }
        req.detailInfo = detail;
        next();
    } catch (error) {
        next(error);
    }
};
const checkExistDeletedList = (Model) => async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await Model.findByPk(id, {
            paranoid: false,
        });
        if (!deletedUser) {
            throw new ErrorHandler(404, 'Dữ Liệu Không Tồn Tại.');
        }
        next();
    } catch (error) {
        next(error);
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
    checkExistDeletedList,
};
