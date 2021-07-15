module.exports = function (app) {
    const trangChuRouters = require('./trangchu');
    const chiTietRouters = require('./chitiet');
    const timKiemRouter = require('./timkiem');
    const themBoHoaRouter = require('./thembohoa');
    const muaHoaRouter = require('./muahoa');
    const gioHangRouter = require('./giohang');
    const dangKyRouter = require('./dangky');
    const dangNhapRouter = require('./dangnhap');
    const dangXuatRouter = require('./dangxuat');

    
    app.use('/dang-nhap', dangNhapRouter);
    app.use('/dang-xuat', dangXuatRouter);
    app.use('/dang-ki', dangKyRouter);
    app.use('/them-bo-hoa', themBoHoaRouter);
    app.use('/chi-tiet-gio-hang', gioHangRouter);
    app.use('/mua-hoa', muaHoaRouter);
    app.use('/tim-kiem', timKiemRouter);
    app.use('/chi-tiet', chiTietRouters);
    app.use('/', trangChuRouters);
}