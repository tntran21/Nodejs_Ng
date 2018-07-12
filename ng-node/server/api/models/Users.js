/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    user_id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    user_email: {
      type: 'string',
      unique: true
    },
    user_password: {
      type: 'string',
      size: 100
    },
    user_fullname: {
      type: 'string',
      size: 50
    },
    user_sex: {
      type: 'string',
      size: 10,
      enum: ["male", "female"]
    }
  },

  // Trước khi lưu mật khẩu vào csdl thì phải mã hóa.
  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.user_password, salt, function (err, hash) {
        if (err) {
          return cb(err);
        }
        if (hash) {
          user.user_password = hash;
          return cb(null, user);
        }
      });
    });
  },

  // Kiểm tra mật khẩu với chuỗi mật khẩu được mã hóa trong csdl.
  comparePassword: function (password, user, cb) {
    bcrypt.compare(password, user.user_password, function (err, match) {
      if (err) {
        return cb(err);
      }
      if (match) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  }
};

