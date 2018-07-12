const jwt = require('jsonwebtoken');
const key ='ngan'
module.exports = {
    //ma hoa
    encode:function(data){
        return jwt.sign({
            id: data
        }, key);
    },
    //giai ma
    decode: function(token){
        try {
            var decoded = jwt.verify(token, key);
            return decoded;
        } catch(err) {
            return false;
        }
    }
}

