const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const session = require("express-session");

const app = express();


app.use(
	session({
		secret: "secretkey",
		resave: false,
		saveUninitialized: true,
	})
);

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "sos7136@",
	database: "vulnnode",
});

const filterStrings = [
	"CREATE",
	"INSERT",
	"UPDATE",
	"DELETE",
	"DROP",
	"ALTER",
	"create",
	"insert",
	"update",
	"delete",
	"drop",
	"alter",
];

router.get('/', function(req,res){ // 2
	res.render('login', {name:req.query.nameQuery, user: req.session.name});
  });


router.post("/", (req, res) => {
	let id = req.body.id;
	let password = req.body.password;
	let attack = 0;
	for (var i = 0; i < filterStrings.length; i++) {
		if (password.includes(filterStrings[i])) {
			attack = 1;
		}
	}
	if (id && password) {
		if (attack) {
			res.send(
				"<script>alert('DB테이블 공격하지마세요!!');history.back();</script>"
			);
		} else {
			connection.query(
				"SELECT * FROM users WHERE id = ? AND password = " +
					`'${password}'`,
				[id, password],
				function (error, results, fields) {
					if (results == undefined) {
						res.send(error);
					} else if (results.length > 0) {
						req.session.loggedin = true;
						req.session.name = id;
						res.redirect("/");
					} else {
						res.send(
							"<script>alert('아이디나 비밀번호가 틀렸습니다!!');history.back();</script>"
						);
					}
					res.end();
				}
			);
		}
	} else {
		res.send("Please enter Username and Password!!");
		res.end();
	}
});

module.exports = router;
