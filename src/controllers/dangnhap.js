const bcrypt = require('bcrypt');
const NguoiDung = require('../models/NguoiDung');

exports.login = async function(req, res) {
    let password = req.body.mat_khau;
    let user = await NguoiDung.findOne({ten_dn: req.body.ten_dn});

    if(!user) 
        return res.redirect('/');

    let hash = user.mat_khau;

    bcrypt.compare(password, hash, function(err, result) {
        if(result) {
            req.session.user = {
                username: req.body.ten_dn,
                hoten: user.ho_ten,
                diachi: user.dia_chi,
                dienthoai: user.so_dt,
                email: user.email,
            }

            return res.redirect('/');
        }
        
        return res.redirect('/');
    });
}