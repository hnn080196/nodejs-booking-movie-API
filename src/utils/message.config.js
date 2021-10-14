export const message200 = {
  message: " Xử Lý Yêu Cầu Thành Công",
};

export const message201 = {
  message: " Thêm Thành Công ",
};
export const message400 = {
  message: "Bad request Định Dạng dữ liệu không đúng",
};
export const message401 = {
  message: " Not authorized ,Bạn chưa đăng nhập",
};
export const message500 = {
  message: "Internal server error, lỗi server",
};

// 200 Xử lý request thành công
// 201 Xử lý request thành công và tạo một nguồn tài liệu mới

// 204 Các máy chủ xử lý yêu cầu thành công, nhưng không trả lại bất kỳ nội dung nào

// 400  Các máy chủ không hiểu được yêu cầu.(bad request)
// 401 (Not authorized) Đề nghị yêu cầu xác thực. Máy chủ có thể trả về phản hồi này yêu cầu xác thực đăng nhập tài khoản và mật khẩu (thông thường máy chủ trả về phản hồi này nếu client gửi request một trang đăng nhập)
// 403 (Forbidden) Máy chủ từ chối yêu cầu.(thông thường nếu đăng nhập không thành công máy chủ sẽ trả về mã lỗi này)
// 500 (Internal server error) Các máy chủ gặp lỗi và không thể thực hiện yêu cầu
