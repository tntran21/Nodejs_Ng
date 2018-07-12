

/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Thu vien ma hoa password 
var bcrypt = require('bcryptjs');
// Mã hóa thông tin đăng nhập tạo token để lưu trạng thái đăng nhập
var jwt = require('../services/jsonwebtoken');

module.exports = {
    // Tạo một người dùng mới. Người dùng được tạo bằng Email
    user_create: function (req, res) {
        // Nhận dữ liệu từ người dùng gửi lên
        var client_user_email = req.param('client_user_email'),
            client_user_password = req.param('client_user_password');

        // Kiểm tra Email
        if (!client_user_email || client_user_email === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập email',
            });
        }

        // Kiểm tra mật khẩu
        if (!client_user_password || client_user_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu',
            });
        }

        /**
         * Kiểm tra email của user đã tồn tại hay chưa, nếu:
         * Tìm thấy: Thông báo lỗi đã tồn tại.
         * Không tìm thấy email, cho tạo user.
         */
        Users.findOne({ user_email: client_user_email }).exec(function (err, find) {
            // Nếu trong quá trình tạo bị lỗi, in lỗi ra màn hình.
            if (err) { return console.log(err); }

            // Tìm thấy email của user.
            if (find) {
                return res.json({
                    status: 'error',
                    message: 'Email đã tồn tại',
                });

            } else {
                // Email của user chưa tồn tại, tiến hành tạo mới.
                Users.create({ user_email: client_user_email, user_password: client_user_password }).exec(function (err, created) {
                    if (err) { return console.log(err) }

                    if (created) {
                        return res.json({
                            status: 'success',
                            message: 'Tạo tài khoản thành công',
                            user: created,
                        });
                    }
                });
            }
        });
    },

    // Xem thông tin của người dùng.
    user_profile: function (req, res) {
        var user_id = req.headers.authID;
        if (!user_id || user_id === '' || user_id === 0) {
            return res.json({
                status: 'error',
                message: 'ID không tồn tại',
            });
        }

        Users.findOne({ user_id: user_id }).exec(function (err, find) {
            if (err) { return console.log(err); }

            if (find) {
                return res.json({
                    status: 'success',
                    message: 'Lấy thông tin thành công',
                    user: find,
                });

            } else {
                return res.json({
                    status: 'error',
                    message: 'Không tìm thấy User với ID:' + user_id,
                });
            }
        });
    },

    /**
     * Update thông tin người dùng bằng cách update theo id.
     * Nếu người dùng có nhập email thì không cho thay đổi email
     * Người dùng không nhập email thì cho thay đổi email nếu muốn.
     */
    user_update: function (req, res) {
        // nhận dữ liệu từ người dùng gửi lên.
        var client_user_id = req.param('client_user_id'),
            update_email = req.param('update_update_email'),
            update_user_fullname = req.param('update_user_fullname'),
            update_user_sex = req.param('update_user_sex');

        // Kiểm tra id gửi lên
        if (!client_user_id || client_user_id === '' || client_user_id === 0) {
            return res.json({
                status: 'error',
                message: 'Id không tồn tại',
            });
        }

        // Người dùng có nhập Email. Tìm
        if ((update_email && update_email != '')) {
            Users.findOne({ user_email: update_email }).exec(function (err, find) {
                if (err) { return console.log(err); }

                if (find) {
                    // Không cho update email
                    Users.update({ user_id: client_user_id }, { user_fullname: update_user_fullname, user_sex: update_user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err); }

                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công',
                            });
                        }
                    });

                    // Không tìm thấy user_email tồn tại trong csdl, cho update email.
                } 
                else {
                    Users.update({ user_id: client_user_id }, { user_email: update_email, user_fullname: user_fullname, user_sex: user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err) }

                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công',
                            })
                        }
                    })
                }
            });
        }
        // Không nhập Email, update theo id.
        else {
            // Tìm id
            Users.findOne({ user_id: client_user_id }).exec(function (err, find) {
                if (err) { return console.log(err) }

                if (find) {
                    Users.update({ user_id: user_id }, { user_fullname: user_fullname, user_sex: user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err) }
                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công',
                            });
                        }
                    });

                } 
                else {
                    return res.json({
                        status: 'error',
                        message: 'Không tìm thấy User với id: ' + user_id,
                    })
                }
            })

        }
    },
    user_delete: function (req, res) {
        var user_id = req.param('user_id');
        if (!user_id || user_id === '' || user_id === 0) {
            return res.json({
                status: 'error',
                message: 'ID not found'
            });
        }
        Users.findOne({ user_id: user_id }).exec(function (err, find) {
            if (err) {
                return console.log(err)
            }
            if (find) {
                Users.destroy({ user_id: user_id }).exec(function (destroy) {
                    return res.json({
                        status: 'success',
                        message: 'Xóa User thành công'
                    });
                });
            }
            else {
                return res.json({
                    status: 'error',
                    message: 'Không tìm thấy User với ID: ' + user_id,
                })
            }
        })
    },

    /**
     * Đăng nhập có:
     * Nhập Email, kiểm tra password.
     * Đăng nhập thành công mã hóa user tạo token.
     */
    login: function (req, res) {
        var user_email = req.param('user_email'),
            user_password = req.param('user_password');

        if (!user_email || user_email === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập Email',
            });
        }

        if (!user_password || user_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu',
            });
        }

        Users.findOne({ user_email: user_email }).exec(function (err, find) {
            if (err) { return console.log(err) }

            if (find) {
                // Tìm thấy tiến hành so sánh password đã được mã hóa
                Users.comparePassword(user_password, find, function (err, valid) {
                    if (err) { return console.log(err) }

                    if (valid) {
                        return res.json({
                            status: 'success',
                            message: 'Đăng nhập thành công',
                            // mã hóa người dùng tạo token.
                            token: jwt.encode(find.user_id),
                        });

                    } 
                    else {
                        return res.json({
                            status: 'error',
                            message: 'Mật khẩu không đúng',
                        });
                    }
                });
                // Nhập Email không đúng, không tìm thấy email    
            } 
            else {
                return res.json({
                    status: 'error',
                    message: 'Email không đúng',
                })
            }
        });
    },

    /**
     * Thay đỗi mật khẩu:
     * Kiểm tra mật khẩu cũ đã được mã hóa.
     * Trước khi lưu mật khẩu mới vào csdl thì phải mã hóa mật khẩu.
     */
    change_password: function (req, res) {
        var user_id = req.param('user_id'),
            old_password = req.param('old_password'),
            new_password = req.param('new_password');

        if (!user_id || user_id === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập ID',
            });
        }

        if (!old_password || old_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu',
            });
        }

        if (!new_password || new_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu mới',
            });
        }

        Users.findOne({ user_id: user_id }).exec(function (err, find) {
            if (err) { return console.log(err); }

            if (find) {
                // So sánh có mật khẩu có đúng với chuỗi đã mã hóa trong csdl không.
                Users.comparePassword(old_password, find, function (err, vaild) {
                    if (err) { return console.log(err); }
                    if (vaild) {
                        // Đúng, mã hóa mật khẩu mới trước khi lưu vào csdl
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(new_password, salt, function (err, hash) {
                                if (err) {
                                    return cb(err);
                                }

                                if (hash) {
                                    Users.update({ user_id: user_id }, { user_password: hash }).exec(function (err, updated) {
                                        if (err) { return cb(err);; }

                                        if (updated) {
                                            return res.json({
                                                status: 'success',
                                                message: 'Đổi mật khẩu thành công',
                                            });
                                        }
                                    });
                                }
                            });
                        });

                        // Nhập mật khẩu cũ không đúng.
                    } 
                    else {
                        return res.json({
                            status: 'error',
                            message: 'Mật khẩu cũ không đúng',
                        });
                    }
                });

            }

            // Nhập user_id không đúng.
            else {
                return res.json({
                    status: 'error',
                    message: 'Không tìm thấy User với ID: ' + user_id,
                });
            }
        });
    },

    // decode: function (req, res) {
    //     console.log(req.headers.authID);
    //     return res.ok();
    //     var data = jwt.decode(req.param('token'));
    //     return res.json({
    //         data: data
    //     });
    // }
};

