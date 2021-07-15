const router = require("express").Router();
var hoa = require('../controllers/hoa');

async function HienThiTimKiem(res, ten) {
    var tttkiem = await hoa.selectFind(ten);
    res.render('trang_tim_kiem', {
        kqtk: tttkiem
    });
}

router.get('/', function (req, res) {
    HienThiTimKiem(res, '');
});



router.post('/', function (req, res) {
    var thongtin = req.body;
    ten = thongtin.ten;
    HienThiTimKiem(res, ten);
});

module.exports = router;