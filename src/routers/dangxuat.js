const router = require("express").Router();
const dangXuatController = require('../controllers/dangxuat');

router.get('/', dangXuatController.logout);

module.exports = router;