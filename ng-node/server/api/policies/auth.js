// Xác thực người dùng
var jwt = require('../services/jsonwebtoken');

// Giả mã token kiểm tra thông tin người dùng.
module.exports = function (req, res, next) {
    if (req.headers.token && req.headers.token != '') {
        var decoded = jwt.decode(req.headers.token);
        console.log(decoded)

        if (decoded.id) {
            req.headers.authID = decoded.id;
            return next();
        }

        if (decoded === false) {
            return res.json({
                status: 'error',
                message: 'Token không hợp lệ',
                isAuth: false
            });
        }
        
    } else {
        return res.json({
            status: 'error',
            message: 'Bạn không đủ quyền truy cập đường dẫn này',
            isAuth: false
        });
    }
}