const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const session = require("express-session");
require("dotenv").config();



const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "vulnnode",
});

const app = express();



app.use(
	session({
		secret: "secretkey",
		resave: false,
		saveUninitialized: true,
	})
);

const filterSQL = [
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
	"\!",
	"\#",
	"\$",
	"\%",
	"\^",
	"\&",
	"&amp",
	"\*",
	"\(",
	"&#40;",
	"\)",
	"&#41",
];

const filterXSS = [
	"script",
	"<",
	"&lt",
	"&gt",
	">",
	"\"",
	"&quot",
	"\'",
	"&#x27",
	"\`",
	"\\",
	"&#x2F"
];




router.get("/", function (req, res) {
	// 2
	res.render("login", { name: req.query.nameQuery, user: req.session.name });
});

router.post("/", (req, res) => {
	let id = req.body.id;
	let password = req.body.password;
	let attack = 0;



	for (var i = 0; i < filterSQL.length; i++) {
		if (password.includes(filterSQL[i])) {
			attack = 1;
		}
		if (id.includes(filterSQL[i])) {
			attack = 1;
		}

	}
	for (var i = 0; i < filterXSS.length; i++) {
		if (password.includes(filterXSS[i])) {
			attack = 1;
		}
		if (id.includes(filterXSS[i])) {
			attack = 1;
		}
	}
	if (id && password) {

		if (attack == 1) {

			res.send(
				"<script>alert('공격하지마세요!!');history.back();</script>"
			);
		}

		else if (id.length >= 13) {
			res.send(
				"<script>alert('아이디를 정책에 맞게 입력해주세요');history.go(-1);</script>"
			);
		} else if (password.length >= 16) {
			res.send(
				"<script>alert('패스워드를 정책에 맞게 입력해주세요');history.go(-1);</script>"
			);
		}
		else {
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




router.get('/find_ID', function (req, res) { // 2
	let code = 0;
	res.render('findID', { user: req.session.name, code: code });
});

router.post('/find_ID', function (req, res) { // 2
	let username = req.body.username;
	let email = req.body.email;
	attack = 0;
	console.log("username: " + username);
	console.log("email:" + email);

	for (var i = 0; i < filterSQL.length; i++) {
		if (username.includes(filterSQL[i])) {
			attack = 1;
		}
		if (email.includes(filterSQL[i])) {
			attack = 1;
		}
	}
	for (var i = 0; i < filterXSS.length; i++) {
		if (username.includes(filterXSS[i])) {
			attack = 1;
		}
		if (email.includes(filterXSS[i])) {
			attack = 1;
		}
	}
	if (attack == 1) {

		res.send(
			"<script>alert('공격하지마세요!!');history.back(-1);</script>"
		);
	} else {

		connection.query(
			"SELECT * from users where username = ? and email = ?",
			[username, email], function (err, results) {
				if (err) console.error("err : " + err);
				if (results.length >= 1) {
					console.log(results[0].id)
					res.render("findID", {
						code: "success",
						results_id: results[0].id,
						results_username: results[0].username,
						results_email: results[0].email
					});
				} else {
					res.send(
						"<script>alert('계정이 존재하지 않습니다.');history.back();</script>"
					);
				}
				console.log(results.length);

			});

	}
});





module.exports = router;
