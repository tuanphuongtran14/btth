var mongoose = require('mongoose');

const loaihoaSchema = mongoose.Schema({
    maloai: String,
    tenloai: String,
})

const LoaiHoa = mongoose.model('LoaiHoa', loaihoaSchema);

module.exports = LoaiHoa;