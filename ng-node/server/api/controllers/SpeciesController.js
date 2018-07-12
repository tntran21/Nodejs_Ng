/**
 * SpeciesController
 *
 * @description :: Server-side logic for managing species
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create_species: function(req, res){
        var species_name = req.param('species_name');
        if(!species_name || species_name === ''){
            return res.json({
                status: 'error',
                message: 'Bạn chưa nhập tên loại'
            })
        }
        Species.create({species_name:species_name}).exec(function(err, created){
            if(err){return console.log(err);}
            if(created){
                return res.json({
                    status: 'success',
                    message: 'Tạo thể loại thành công',
                })
            }
        });
    },
    get_species: function(req, res){
       Species.find().exec(function(err, find){
           if(err){return console.log(err);}
           if(find){ 
               return res.json({
                   status: 'success',
                   message: 'Lay danh sach thanh cong',
                   species: find
               });
           }
       });
    },
    del_species: function(req, res){
        var species_id = req.param('species_id');
        if(!species_id || species_id === ''){
            return res.json({
                status: 'error',
                message: 'Id khong hop le'
            });
        }
       Species.destroy({species_id: species_id}).exec(function(err){
           if(err){ return console.log(err);}
           return res.json({
               status: 'success',
               message: 'Xoa loai thanh cong'
           });
       })

    }
	
};

