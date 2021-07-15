var mongoose = require('mongoose');

const hoaSchema = mongoose.Schema({
    mahoa: String,
    maloai: String,
    tenhoa: String,
    giaban: Number,
    hinh: String,
    mota: String
})
const Hoa = mongoose.model('Hoa', hoaSchema);

module.exports = Hoa;