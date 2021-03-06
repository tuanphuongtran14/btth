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
    // X??? l?? g???i mail kh??ch h??ng
    let customerMailContent = `
        <h1 align='center'>Th??ng Tin ????n H??ng #${kq.sodh}</h1>
        <p>H??? t??n: ${thongtin.ho_ten}</p>
        <p>?????a ch??? giao h??ng: ${thongtin.dia_chi}</p>
        <p>Email: ${thongtin.email}</p>
        <p>S??? ??i???n tho???i: ${thongtin.dien_thoai}</p>
        <table width='100%' cellspacing='0' cellpadding='2' border='1'>
            <tr>
                <td width='10%'>STT</td>
                <td width='15%'>M?? hoa</td>
                <td width='30%'>T??n hoa</td>
                <td width='10%'>SL</td>
                <td width='15%'>????n gi??</td>
                <td>Th??nh ti???n</td>
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
                <td>${giohang[i].giaban.toLocaleString('DE-de')}VN??</td>
                <td>${(giohang[i].giaban * giohang[i].soluong).toLocaleString('DE-de')}VN??</td>
            </tr>
        `

        tongtien += giohang[i].giaban  * giohang[i].soluong;
        stt++;
    }
    
    customerMailContent += `
            <tr>
                <td colspan='6' align='right'>T???ng th??nh ti???n: ${tongtien.toLocaleString('DE-de')}VN?? </td>
            </tr>
        </table>
        <p>C???m ??n qu?? kh??ch ???? ?????t h??ng, ????n h??ng s??? ???????c giao trong th???i gian s???m nh???t/p>
    `;

    sendmail(thongtin.email, `????n h??ng #${kq.sodh} ?????t h??ng th??nh c??ng - Shop hoa t????i UIT`, customerMailContent);

    // X??? l?? g???i mail nh??n vi??n
    let staffMailContent = `
        <h1 align='center'>????n h??ng m???i #${kq.sodh}</h1>
        <p>M???t ????n h??ng m???i v???a ???????c ?????t t???i website</p>
        <hr />
        <p>H??? t??n: ${thongtin.ho_ten}</p>
        <p>?????a ch??? giao h??ng: ${thongtin.dia_chi}</p>
        <p>Email: ${thongtin.email}</p>
        <p>S??? ??i???n tho???i: ${thongtin.dien_thoai}</p>
        <table width='100%' cellspacing='0' cellpadding='2' border='1'>
            <tr>
                <td width='10%'>STT</td>
                <td width='15%'>M?? hoa</td>
                <td width='30%'>T??n hoa</td>
                <td width='10%'>SL</td>
                <td width='15%'>????n gi??</td>
                <td>Th??nh ti???n</td>
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
                <td>${giohang[i].giaban.toLocaleString('DE-de')}VN??</td>
                <td>${(giohang[i].giaban * giohang[i].soluong).toLocaleString('DE-de')}VN??</td>
            </tr>
        `

        tongtien += giohang[i].giaban  * giohang[i].soluong;
        stt++;
    }
    
    staffMailContent += `
            <tr>
                <td colspan='6' align='right'>T???ng th??nh ti???n: ${tongtien.toLocaleString('DE-de')}VN?? </td>
            </tr>
        </table>
    `;

    const staffEmail = process.env.STAFF_MAIL;
    sendmail(staffEmail, `????n h??ng m???i #${kq.sodh} - Shop hoa t????i UIT`, staffMailContent);

    if(kq) 
        req.session.giohang = undefined;
    
    res.render('trang_giao_hang', { diachi: thongtin.dia_chi });
})

module.exports = router;