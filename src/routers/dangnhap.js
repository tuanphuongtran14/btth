const router = require("express").Router();
const dangNhapController = require('../controllers/dangnhap');

router.post('/', dangNhapController.login);

module.exports = router;