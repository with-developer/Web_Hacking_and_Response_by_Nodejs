const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
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

router.post("/", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let attack = 0;
	for (var i = 0; i < filterStrings.length; i++) {
		if (password.includes(filterStrings[i])) {
			attack = 1;
		}
	}
	if (username && password) {
		if (attack) {
			res.send(
				"<script>alert('DB테이블 공격하지마세요!!');history.back();</script>"
			);
		} else {
			connection.query(
				"SELECT * FROM users WHERE username = ? AND password = " +
					`'${password}'`,
				[username, password],
				function (error, results, fields) {
					if (results == undefined) {
						res.send(error);
					} else if (results.length > 0) {
						req.session.loggedin = true;
						req.session.username = username;
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
