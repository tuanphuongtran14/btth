const mongoose = require('mongoose');

const DonHangSchema = new mongoose.Schema({
    sodh: Number,
    hoten: String,
    diachi: String,
    dienthoai: String,
    email: String,
    dsmh: [
        {
            mahoa: String,
            tenhoa: String,
            soluong: Number,
            dongia: Number,
            thanhtien: Number
        }
    ]
});

const DonHang = mongoose.model('DonHang', DonHangSchema);

module.exports = DonHang;