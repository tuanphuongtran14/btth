// JavaScript Document
const LoaiHoa = require('../models/LoaiHoa.js');
const Hoa = require('../models/Hoa.js');

module.exports.select = async function (maloaihoa) {
    const query = {};
    query["maloai"] = maloaihoa;
    const dshoa = await Hoa.find(query);
    let kq = `<table width='100%' align='center'>`;

    for (i = 0; i < dshoa.length; i++) {
        if (i % 3 == 0)
            kq += `<tr>`;

        kq += `
            <td width='33%' style='text-align: center;'>
                <img src='/images/${dshoa[i].hinh}' style='width: 150px'></br>
                <a href='/chi-tiet/${dshoa[i].mahoa}'>Tên hoa: ${dshoa[i].tenhoa}</a>
                <a href='/mua-hoa/${dshoa[i].mahoa}'>
                    <img src='/images/gio_hang.jpg' height='35px' />
                </a></br>
                <i>Giá bán: </i> ${Number(dshoa[i].giaban).toLocaleString('de-DE')}VNĐ
            </td>
        `

        if ((i + 1) % 3 == 0)
            kq += `</tr>`;
    }

    kq += `</table>`;
    return kq;
}

module.exports.selectChitiet = async function (mahoa) {
    const query = {};
    query["mahoa"] = mahoa;
    const hoa = await Hoa.findOne(query);

    let kq = `
        <table width='60%' align='center' style='margin: 0 auto'>
            <tr>
                <td width='40%' align='center'>
                    <img src='/images/${hoa.hinh}' style='width: 150px'>
                </td>
                <td width='60%'>
                    Tên hoa: ${hoa.tenhoa} </br>
                    Giá bán: ${hoa.giaban} </br>
                    Mô Tả: ${hoa.mota} </br>
                    <a href='/${hoa.maloai}'>Về Trang Chủ</a>
                </td>
            </tr>
        </table>
    `;

    return kq;
}

module.exports.selectByCode = async function (mahoa) {
    var query = {};
    query["mahoa"] = mahoa;
    var hoa = await Hoa.findOne(query);

    return hoa;
}

module.exports.selectFind = async function (tenhoa) {
    var query = {};
    query["tenhoa"] = {
        $regex: tenhoa,
        $options: 'i'
    };
    var dshoa = await Hoa.find(query);

    var kq = `<table width='100%' align='center' >`;

    for (i = 0; i < dshoa.length; i++) {
        if (i % 2 == 0)
            kq += `<tr>`
        
        kq += `
                <td width='50%'>
                    <table width='100%'>
                        <tr>
                            <td width='40%'>
                                <img src='/images/${dshoa[i].hinh}'>
                            </td>
                            <td width='60%'>
                                Tên hoa: <b>${dshoa[i].tenhoa}</b> </br>
                                Giá bán: ${dshoa[i].giaban} </br>
                                Mô Tả: ${dshoa[i].mota} </br>
                                <a href='/${dshoa[i].maloai}'>Về Trang Chủ</a>
                            </td>
                        </tr>
                    </table>
                </td>
        `;
        
        if ((i + 1) % 2 == 0)
            kq += `</tr>`;
    }

    kq = kq + "</table>";
    return kq;
}

module.exports.addNewFlower = async function (input) {
    const lastHoa = await Hoa.findOne().sort({
        _id: -1
    });
    let mahoa = 1;

    if (lastHoa)
        mahoa = Number(lastHoa.mahoa) + 1;

    const boHoaMoi = new Hoa({
        ...input,
        mahoa
    });

    return await boHoaMoi.save();
}