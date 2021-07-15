const router = require("express").Router();
const donhang = require('../controllers/donhang');
const hoa = require('../controllers/hoa');
const nodemailer = require('nodemailer');

function sendmail(tomail, tieude, noidung) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'banhangnodejs@gmail.com',
			pass: 'node123$%^'
		}
	});

	const mailOptions = {
		from: 'banhangnodejs@gmail.com',
		to: tomail,
		subject: tieude,
		html: noidung
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log(err);
		}
	})
}

router.get('/:mahoa', async function(req, res) {
    const { mahoa } = req.params;
    const hm = await hoa.selectByCode(mahoa);

    if(req.session.giohang === undefined) {
        req.session.giohang = [];
        let h = {
            mahoa,
            tenhoa: hm.tenhoa,
            giaban: hm.giaban,
            hinh: hm.hinh,
            soluong: 1
        };

        req.session.giohang[0] = h;
    } else {
        let co = 0;
        for(let i = 0; i < req.session.giohang.length; i++)
            if(req.session.giohang[i].mahoa === mahoa) {
                req.session.giohang[i].soluong++;
                req.session.giohang[i].thanhtien = req.session.giohang[i].soluong * req.session.giohang[i].dongia;
                co = 1;
                break;
            }

        if(co === 0) {
            let h = {
                mahoa,
                tenhoa: hm.tenhoa,
                giaban: hm.giaban,
                hinh: hm.hinh,
                soluong: 1
            };
    
            req.session.giohang.push(h);
        }
    }
    res.redirect('/' + hm.maloai);
});

router.post('/xu-ly-dat-hang', async function(req, res) {
    const thongtin = req.body;
    let dh = {
        hoten: thongtin.ho_ten,
        diachi: thongtin.dia_chi,
        dienthoai: thongtin.dien_thoai,
        email: thongtin.email,
        dsmh: req.session.giohang
    }

    const kq = await donhang.insert(dh);

    const giohang = req.session.giohang;
    // Xử lý gửi mail khách hàng
    let customerMailContent = `
        <h1 align='center'>Thông Tin Đơn Hàng #${kq.sodh}</h1>
        <p>Họ tên: ${thongtin.ho_ten}</p>
        <p>Địa chỉ giao hàng: ${thongtin.dia_chi}</p>
        <p>Email: ${thongtin.email}</p>
        <p>Số điện thoại: ${thongtin.dien_thoai}</p>
        <table width='100%' cellspacing='0' cellpadding='2' border='1'>
            <tr>
                <td width='10%'>STT</td>
                <td width='15%'>Mã hoa</td>
                <td width='30%'>Tên hoa</td>
                <td width='10%'>SL</td>
                <td width='15%'>Đơn giá</td>
                <td>Thành tiền</td>
            </tr>
    `;
    let stt = 1;
    let tongtien = 0;
    for(let i = 0; i < giohang.length; i++) {
        customerMailContent += `
            <tr>
                <td>${stt}</td>
                <td>${giohang[i].mahoa}</td>
                <td>${giohang[i].tenhoa}</td>
                <td>${giohang[i].soluong}</td>
                <td>${giohang[i].giaban.toLocaleString('DE-de')}VNĐ</td>
                <td>${(giohang[i].giaban * giohang[i].soluong).toLocaleString('DE-de')}VNĐ</td>
            </tr>
        `

        tongtien += giohang[i].giaban  * giohang[i].soluong;
        stt++;
    }
    
    customerMailContent += `
            <tr>
                <td colspan='6' align='right'>Tổng thành tiền: ${tongtien.toLocaleString('DE-de')}VNĐ </td>
            </tr>
        </table>
        <p>Cảm ơn quý khách đã đặt hàng, đơn hàng sẽ được giao trong thời gian sớm nhất/p>
    `;

    sendmail(thongtin.email, `Đơn hàng #${kq.sodh} đặt hàng thành công - Shop hoa tươi UIT`, customerMailContent);

    // Xử lý gửi mail nhân viên
    let staffMailContent = `
        <h1 align='center'>Đơn hàng mới #${kq.sodh}</h1>
        <p>Một đơn hàng mới vừa được đặt tại website</p>
        <hr />
        <p>Họ tên: ${thongtin.ho_ten}</p>
        <p>Địa chỉ giao hàng: ${thongtin.dia_chi}</p>
        <p>Email: ${thongtin.email}</p>
        <p>Số điện thoại: ${thongtin.dien_thoai}</p>
        <table width='100%' cellspacing='0' cellpadding='2' border='1'>
            <tr>
                <td width='10%'>STT</td>
                <td width='15%'>Mã hoa</td>
                <td width='30%'>Tên hoa</td>
                <td width='10%'>SL</td>
                <td width='15%'>Đơn giá</td>
                <td>Thành tiền</td>
            </tr>
    `;
    stt = 1;
    tongtien = 0;
    for(let i = 0; i < giohang.length; i++) {
        staffMailContent += `
            <tr>
                <td>${stt}</td>
                <td>${giohang[i].mahoa}</td>
                <td>${giohang[i].tenhoa}</td>
                <td>${giohang[i].soluong}</td>
                <td>${giohang[i].giaban.toLocaleString('DE-de')}VNĐ</td>
                <td>${(giohang[i].giaban * giohang[i].soluong).toLocaleString('DE-de')}VNĐ</td>
            </tr>
        `

        tongtien += giohang[i].giaban  * giohang[i].soluong;
        stt++;
    }
    
    staffMailContent += `
            <tr>
                <td colspan='6' align='right'>Tổng thành tiền: ${tongtien.toLocaleString('DE-de')}VNĐ </td>
            </tr>
        </table>
    `;

    const staffEmail = process.env.STAFF_MAIL;
    sendmail(staffEmail, `Đơn hàng mới #${kq.sodh} - Shop hoa tươi UIT`, staffMailContent);

    if(kq) 
        req.session.giohang = undefined;
    
    res.render('trang_giao_hang', { diachi: thongtin.dia_chi });
})

module.exports = router;