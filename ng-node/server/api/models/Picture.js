/**
 * Picture.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // Khai báo thông tin của một ảnh
  attributes: {
    pic_id:{
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    pic_name:{
      type: 'string',
      size: 100,
    }
  }
};

