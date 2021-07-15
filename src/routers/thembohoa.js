const router = require("express").Router();
const loaihoa = require('../controllers/loaihoa');
const hoa = require('../controllers/hoa');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
const upload = multer({ storage: storage });

async function HienThiThemBoHoa(req, res) {
    var dslhoa = await loaihoa.displayAsOptions();
    
    res.render('them_bo_hoa', {
        dslh: dslhoa,
    });
}

async function ThemBoHoa(req, res) {
    upload.single('file')(req, res, function (err) {
        if (err) {
          // A error occurred when uploading.
          res.send('Có lỗi xảy ra trong quá trình uploading!!! Vui lòng thử lại');
        } else {
          const input = req.body;
          input.hinh = req.file.filename;

          hoa.addNewFlower(input);

          res.redirect('/');
        }
      })
}

router.get('/', HienThiThemBoHoa);
router.post('/', ThemBoHoa);

module.exports = router;