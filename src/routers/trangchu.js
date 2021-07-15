const router = require("express").Router();
var loaihoa = require('../controllers/loaihoa');
var hoa = require('../controllers/hoa');

function ThongTinGioHang(req) {
    let ttgh = "";
    let sl = 0, tt = 0;
    
    if(req.session.giohang) {
        for(let i = 0; i < req.session.giohang.length; i++) {
            sl += req.session.giohang[i].soluong;
            tt += req.session.giohang[i].soluong * req.session.giohang[i].giaban;
        }
        ttgh = `<b>Số lượng: </b>${sl}</br><b>Thành tiền: </b>${tt}</br><a href='chi-tiet-gio-hang'>Chi tiết...</a>`
    }
    return ttgh;
}

async function HienThi(req, res, maloai) {
    var dslhoa = await loaihoa.select();
    var chitiethoa = await hoa.select(maloai);
    var tenkh = '';
    if(req.session.user)
        tenkh = req.session.user.username;

    var ttgh = ThongTinGioHang(req);

    res.render('trang_chu', {
        dslh: dslhoa,
        dshoa: chitiethoa,
        tendn: tenkh,
        ttgh: ttgh
    });
}

router.get('/', function (req, res) {
    HienThi(req, res, 'hoa-cuc');
});

router.get('/:maloai', function (req, res) {
    var maloai = req.params.maloai;
    HienThi(req, res, maloai);
});

module.exports = router;