// JavaScript Document
const LoaiHoa = require ('../models/LoaiHoa.js');

module.exports.select = async function() {
	const dsloaihoa = await LoaiHoa.find();
	let kq = ``;

	for(let i=0; i < dsloaihoa.length; i++)
		kq += `<a href='/${dsloaihoa[i].maloai}'>${dsloaihoa[i].tenloai}</a><br>`;
	
    return kq;
}

module.exports.displayAsOptions = async function ()
{
	const dsloaihoa = await LoaiHoa.find();

	let kq="";
    
    for(let i=0; i < dsloaihoa.length; i++)
        kq += `<option value="${dsloaihoa[i].maloai}">${dsloaihoa[i].tenloai}</option>`;
	
    return kq;
}
