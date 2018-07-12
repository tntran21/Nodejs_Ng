

/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//Thu vien ma hoa password 
var bcrypt = require('bcryptjs');
//Ma hoa thong tin sau khi dang nhap thanh chuoi token de luu trang thai dang nhap
var jwt = require('../services/jsonwebtoken');

module.exports = {
    // Tạo một người dùng mới:
    user_create: function (req, res) {
        // Nhan du lieu tu client gui len
        var user_email = req.param('user_email'),
            user_password = req.param('user_password');

        // Kiem tra email
        if (!user_email || user_email === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập email'
            });
        }
        //Kiem tra mat khau
        if (!user_password || user_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu'
            });
        }
        /**
         * Kiểm tra email của user đã tồn tại hay chưa, nếu:
         * Tìm thấy: Thông báo lỗi đã tồn tại
         */
        Users.findOne({ user_email: user_email }).exec(function (err, find) {
            //Neu trong qua trinh tao bi loi thi in ra man hinh
            if (err) { return console.log(err) }
            //User da ton tai
            if (find) {
                return res.json({
                    status: 'error',
                    message: 'Email đã tồn tại'
                })
            } else {
                //User chua ton tai, tien hanh tao moi
                Users.create({ user_email: user_email, user_password: user_password }).exec(function (err, created) {
                    if (err) { return console.log(err) }
                    if (created) {
                        return res.json({
                            status: 'success',
                            message: 'Tạo tài khoản thành công',
                            user: created
                        });
                    }
                });
            }
        });
    },
    user_profile: function (req, res) {
        var user_id = req.headers.authID;
        // var user_id = req.param('user_id');
        if (!user_id || user_id === '' || user_id === 0) {
            return res.json({
                status: 'error',
                message: 'ID không tồn tại'
            });
        }
        Users.findOne({ user_id: user_id }).exec(function (err, find) {
            if (err) { return console.log(err); }
            if (find) {
                return res.json({
                    status: 'success',
                    message: 'Lấy thông tin thành công',
                    user: find
                });
            } else {
                return res.json({
                    status: 'error',
                    message: 'Không tìm thấy User với ID:' + user_id
                });
            }
        });
    },
    user_update: function (req, res) {
        var user_id = req.param('user_id'),
            update_email = req.param('update_email'),
            user_fullname = req.param('user_fullname'),
            user_sex = req.param('user_sex');
        if (!user_id || user_id === '' || user_id === 0) {
            return res.json({
                status: 'error',
                message: 'Id không tồn tại'
            })
        }
        //Neu nguoi dung co nhap email len thi tim va update theo email
        if ((update_email && update_email != '')) {
            Users.findOne({ user_email: update_email }).exec(function (err, find) {
                if (err) { return console.log(err) }
                if (find) {
                    //Tim thay email thi k cho update email
                    //Update theo id(id khong doi) chuoi sau la tat ca thong tin co the thay doi:fullname, sex
                    Users.update({ user_id: user_id }, { user_fullname: user_fullname, user_sex: user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err); }
                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công'
                            });
                        }
                    });
                    //Khong tim thay email thi cho update email
                } else {
                    Users.update({ user_id: user_id }, { user_email: update_email, user_fullname: user_fullname, user_sex: user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err) }
                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công'
                            })
                        }
                    })
                }
            });
        }
        //Neu nguoi dung khong nhap email thi update theo id
        else {
            Users.findOne({ user_id: user_id }).exec(function (err, find) {
                if (err) { return console.log(err) }
                if (find) {
                    Users.update({ user_id: user_id }, { user_fullname: user_fullname, user_sex: user_sex }).exec(function (err, updated) {
                        if (err) { return console.log(err) }
                        if (updated) {
                            return res.json({
                                status: 'success',
                                message: 'Update thông tin User thành công'

                            });

                        }
                    });
                } else {
                    return res.json({
                        status: 'error',
                        message: 'Không tìm thấy User với id: ' + user_id
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
                    message: 'Không tìm thấy User với ID: ' + user_id
                })
            }
        })
    },
    login: function (req, res) {
        // console.log(req.params.all());
        // return;

        var user_email = req.param('user_email'),
            user_password = req.param('user_password');
        if (!user_email || user_email === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập Email'
            });
        }
        if (!user_password || user_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu'
            });
        }
        Users.findOne({ user_email: user_email }).exec(function (err, find) {
            if (err) { return console.log(err) }
            if (find) {
                Users.comparePassword(user_password, find, function (err, valid) {
                    if (err) { return console.log(err) }
                    if (valid) {
                        return res.json({
                            status: 'success',
                            message: 'Đăng nhập thành công',
                            token: jwt.encode(find.user_id)
                        })
                    } else {
                        return res.json({
                            status: 'error',
                            message: 'Mật khẩu không đúng'
                        })
                    }
                })
            } else {
                return res.json({
                    status: 'error',
                    message: 'Email không đúng'
                })
            }
        });
    },
    change_password: function (req, res) {
        var user_id = req.param('user_id'),
            old_password = req.param('old_password'),
            new_password = req.param('new_password');
        if (!user_id || user_id === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập ID'
            });
        }
        if (!old_password || old_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu'
            });
        }
        if (!new_password || new_password === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập mật khẩu mới'
            });
        }
        Users.findOne({ user_id: user_id }).exec(function (err, find) {
            if (err) { return console.log(err); }
            if (find) {
                Users.comparePassword(old_password, find, function (err, vaild) {
                    if (err) { return console.log(err); }
                    if (vaild) {
                        //Truoc khi update vao csdl thì phải hash
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
                                                message: 'Đổi mật khẩu thành công'
                                            });
                                        }
                                    });
                                }
                            });
                        });

                    } else {
                        return res.json({
                            status: 'error',
                            message: 'Mật khẩu cũ không đúng'
                        });
                    }
                });

            }
            else {
                return res.json({
                    status: 'error',
                    message: 'Không tìm thấy User với ID: ' + user_id
                });
            }
        });


    },
    decode: function (req, res) {
        // console.log(req.headers.authID);
        // return res.ok();
        // var data = jwt.decode(req.param('token'));
        // return res.json({
        //     data: data
        // });
    }
};

