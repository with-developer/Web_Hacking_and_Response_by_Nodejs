const express = require("express");
const { rmSync } = require("fs");
const router = express.Router();
const mysql = require("mysql2");
const path = require("path");

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "vulnnode",
});

router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "/public/signup.html"));
});

router.post("/", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	if (username && password && email) {
		connection.query(
			"INSERT INTO users (username, password, email) VALUES ?",
			[[[username, password, email]]],
			function (error, results, fields) {
				if (error) throw error;
				if (results.affectedRows > 0) {
					res.send(
						"<script>alert('회원가입이 완료되었습니다.');history.go(-2);</script>"
					);
				} else {
					res.send(
						"<script>alert('아이디와 이메일을 입력해주세요.');</script>"
					);
				}
				res.end();
			}
		);
	} else {
		res.send("<script>alert('아이디와 이메일을 입력해주세요.')</script>");
		res.end();
	}
});

router.post("/idcheck", (req, res) => {
	const username = req.body.username;
	let result = 0;
	if (username) {
		connection.query(
			"SELECT * FROM users WHERE username = ?",
			[[username]],
			function (error, results, fields) {
				if (error) throw error;
				if (results.length == undefined || results.length < 1) {
					result = 1;
				}
				const resp = {
					result,
				};
				res.send(JSON.stringify(resp));
			}
		);
	}
});

module.exports = router;
