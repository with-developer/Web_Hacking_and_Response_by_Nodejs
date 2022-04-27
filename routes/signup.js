const express = require("express");
const { rmSync } = require("fs");
const router = express.Router();
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "vulnnode",
});

router.get("/", function (req, res) {
	// 2
	res.render("signup", { name: req.query.nameQuery });
});

router.post("/", (req, res) => {
	let id = req.body.id;
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let phoneNumber = req.body.phoneNumber;
	if (id && username && password && email && phoneNumber) {
		connection.query(
			"INSERT INTO users (id, password, username, email, phoneNumber) VALUES ?",
			[[[id, password, username, email, phoneNumber]]],
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
	const id = req.body.id;
	let result = 0;
	if (id) {
		connection.query(
			"SELECT * FROM users WHERE id = ?",
			[[id]],
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
