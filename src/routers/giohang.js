const router = require("express").Router();
const loaihoa = require('../controllers/loaihoa');

router.get('/', function(req, res) {
    let giohang = req.session.giohang;
    let ttctgh = "<table width='100%' height='250px'><tr><td align='center'>Chưa có sản phẩm nào trong giỏ hàng của bạn</td></tr></table>";
    let hoten= "";
    let diachi= "";
    let email= "";
    let dienthoai= "";
    let hienThiDatHang = false;

    if(req.session.user) {
        hoten = req.session.user.hoten;
        diachi = req.session.user.diachi;
        dienthoai = req.session.user.dienthoai;
        email = req.session.user.email;
    }

    if(giohang) {
        ttctgh = "<form action='/chi-tiet-gio-hang/cap-nhat-gio-hang' method='POST'><table width='100%' cellspacing='0' cellpadding='2' border='1'";
        ttctgh += "<tr><td width='10%'>STT</td><td width='10%'>Mã hoa</td><td width='30%'>Tên hoa</td><td width='10%'>SL</td>" +
        "<td width='15%'>Đơn giá</td><td>TT</td><td>Xóa</td>";
        let stt = 1;
        for(let i = 0; i < giohang.length; i++) {
            ttctgh += "<tr><td>" + stt + "</td><td>" + giohang[i].mahoa + "</td><td>" + giohang[i].tenhoa
            + "</td><td><input type='number' value='" + giohang[i].soluong + "' name='txtsl" + giohang[i].mahoa
            + "'/></td><td>" + giohang[i].giaban + "</td><td>" + (giohang[i].giaban * giohang[i].soluong) 
            + "</td><td><a href='/chi-tiet-gio-hang/xoa-don-hang/" + giohang[i].mahoa  + "'>Xóa</a></td></tr>";

            stt++;
        }
        ttctgh += "<tr><td colspan='7' align='right'><button type='submit'>Cập nhật</button></td></tr></table></form>";
        hienThiDatHang = true;
    }

    res.render('trang_dat_hang', {ttctgh: ttctgh, hoten, diachi, dienthoai, email, hienThiDatHang});
});

router.get('/xoa-don-hang/:mahoa', function(req, res) {
    const mahoa = req.params.mahoa;
    for(let i = 0; i < req.session.giohang.length; i++) {
        if(req.session.giohang[i].mahoa === mahoa) {
            req.session.giohang.splice(i, 1);
            if(req.session.giohang.length === 0) 
                req.session.giohang = undefined;
            break;
        }
    }

    res.redirect('/chi-tiet-gio-hang')
});

router.post('/cap-nhat-gio-hang', function(req, res) {
    const thongtin = req.body;

    for(let i = 0; i < req.session.giohang.length; i++) {
        req.session.giohang[i].soluong = eval("thongtin.txtsl" + req.session.giohang[i].mahoa) * 1;
    }

    res.redirect('/chi-tiet-gio-hang')
});

module.exports = router;