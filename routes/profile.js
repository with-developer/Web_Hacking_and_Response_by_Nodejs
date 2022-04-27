const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "vulnnode",
});

router.get("/", function (req, res) {
	let id = req.session.name;

	connection.query(
		"select * from users where id = ? ",
		[[[id]]],
		function (error, results, field) {
			if (error) {
				throw error;
			}

			if (results.length == 0) {
				res.send(
					"<script>alert('로그인 후 프로필을 확인하세요.');history.back();</script>"
				);
			} else {
				console.log(results[0].id + "님이 /profile에 접속했습니다.");
				res.render("profile", {
					userinfo: results[0],
					user: req.session.name,
				});
			}
		}
	);

	//res.render('profile', {name: req.session.name, id: req.session.id, test: test});
});

module.exports = router;
