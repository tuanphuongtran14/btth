const router = require("express").Router();
var hoa = require('../controllers/hoa');

async function HienThiChiTiet(res, mahoa) {
    var ttchitiethoa = await hoa.selectChitiet(mahoa);
    res.render('trang_chi_tiet_hoa', {
        chitiethoa: ttchitiethoa
    });
}

router.get('/:mahoa', function (req, res) {
    var mahoa = req.params.mahoa;
    HienThiChiTiet(res, mahoa);

});

module.exports = router;