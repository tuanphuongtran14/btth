const NguoiDung = require('../models/NguoiDung');
const bcrypt = require('bcrypt');

exports.render = function(req, res) {
    if(!req.session.user)
        return res.render("trang_dang_ky", {error_messages: '', success_messages: ''});
    
    return res.redirect('/');
};

exports.createUser = function(req, res) {
    const saltRounds = 10;
    let newUserInput = req.body;
    

    if(!newUserInput) {
        res.status(400).send({
            message: "Can't create an empty user"
        })
    } 

    bcrypt.hash(newUserInput.mat_khau, saltRounds, async function(err, hash) {
        if(err) {
            res.status(500).send({
                message: err.message || "Error while hashing password"
            })
        }

        let checkUsername = await NguoiDung.findOne({ten_dn: newUserInput.ten_dn});
        let checkEmail = await NguoiDung.findOne({email: newUserInput.email});

        if(checkUsername) {
            req.flash('error', "Tên đăng nhập đã tồn tại!!!");
            return res.render("trang_dang_ky", {error_messages: req.flash("error"), success_messages: ''});
        } 

        if(checkEmail) {
            req.flash('error', "Email đăng kí đã tồn tại!!!");
            return res.render("trang_dang_ky", {error_messages: req.flash("error"), success_messages: ''});
        } 
        
        newUserInput.mat_khau = hash;
        delete newUserInput.mat_khau1;
 
        let newUser = new NguoiDung({
            ...newUserInput
        });

        let result = await newUser.save();

        if(result) {
            req.flash("success", "Tạo tài khoản thành công!!!");
            res.render("trang_dang_ky", {error_messages: '', success_messages: req.flash("success")});
        }
    });
}