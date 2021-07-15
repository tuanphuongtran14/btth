const router = require("express").Router();
const dangKyController = require('../controllers/dangky');

router.get('/', dangKyController.render);

router.post('/', dangKyController.createUser);

module.exports = router;