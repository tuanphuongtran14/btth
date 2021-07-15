const DonHang = require('../models/DonHang');

exports.select = async function(sodh) {
    const donHang = await DonHang.find({ sodh });

    return donHang;
};


exports.insert = async function(input) {
    const lastDonHang = await DonHang.findOne({});

    let sodh = 1;

    if(lastDonHang) 
        sodh = Number(lastDonHang.sodh) + 1;
    
    const donHangMoi = new DonHang({
        sodh,
        ...input
    });

    await donHangMoi.save();

    return donHangMoi;
};


