require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const { join } = require('path');
const app = express();


// Khai báo view engine là ejs và thiết lập view directory
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src/views'))

// Thiết lập thư mục public cho server
var publicDir = join(__dirname, '/public');
app.use(express.static(publicDir));

// Thiết lập json và urlencoded
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}))

// Sử dụng cookie và session
app.use(cookieParser('secretString'));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: '18521280',
	cookie: {
		maxAge: 60000
	}
}));

// Sử dụng flash
app.use(flash());

// Khai báo routers
require('./src/routers/index')(app);

// Kết nối tới cơ sở dữ liệu
const CONNECTION_URL = process.env.DATABASE_URL;

mongoose.connect(CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('Connect to database successfully'))
	.catch(error => console.log(`${error} did not connect`));

// Bắt đầu lắng nghe các yêu cầu thông qua PORT chỉ định
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => 
	console.log(`Server Running on Port: http://localhost:${PORT}`));