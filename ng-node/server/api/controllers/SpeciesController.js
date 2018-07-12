/**
 * SpeciesController
 *
 * @description :: Server-side logic for managing species
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    // Tạo một loại 
    create_species: function(req, res) {
        var species_name = req.param('species_name');
        
        if (!species_name || species_name === '') {
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập tên loại',
            });
        }
        
        Species.create({ species_name: species_name }).exec(function(err, created) {
            if (err) { return console.log(err); }

            if (created) {
                return res.json({
                    status: 'success',
                    message: 'Tạo thể loại thành công',
                });
            }
        });
    },

    // Lấy danh sách loại (Sử dụng .find thay cho .findOne)
    get_species: function(req, res) {
       Species.find().exec(function(err, find) {
           if (err) { return console.log(err); }

           if (find) { 
               return res.json({
                   status: 'success',
                   message: 'Lấy danh sách thể loại thành công',
                   species: find,
               });
           }
       });
    },

    // Xóa thể loại
    del_species: function(req, res) {
        var species_id = req.param('species_id');

        if (!species_id || species_id === 0 || species_id === '') {
            return res.json({
                status: 'error',
                message: 'ID không hợp lệ',
            });
        }

       Species.destroy({species_id: species_id}).exec(function(err){
           if(err){ return console.log(err);}
           return res.json({
               status: 'success',
               message: 'Xóa thể loại thành công'
           });
       });
    },

    // Update thông tin thể loại.
    update_species: function(req, res) {
        var species_id  = param("species_id");
            species_name = param("species_name");

        if(!species_id || species_id === 0 ||  species_id === ''){
            return  res.json({
                status: "error",
                message: "ID không hợp lệ",
            });
        }

        Species.findOne({ species_id: species_id }).exec(function(err, find){
            if(err){ return console.log(err); }

            if(find){
                Species.update({ species_id: species_id }, {species_name: species_name}).exec(function(err, updated){
                    if(err) { return console.log(err); }

                    if(updated) {
                        return  res.json({
                            status: "success",
                            message: "Update thể loại thành công",
                        });
                    }
                });
            }

            else {
                return  res.json({
                    status: "error",
                    message: "Không tìm thấy thể loại với ID là: " + species_id,
                });
            }
        });
    },
};

