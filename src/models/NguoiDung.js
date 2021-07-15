const mongoose = require('mongoose');

const nguoiDungSchema = new mongoose.Schema({
    ten_dn: String,
    mat_khau: String,
    ho_ten: String,
    email: String,
    dia_chi: String,
    so_dt: String
})

const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema);

module.exports = NguoiDung;