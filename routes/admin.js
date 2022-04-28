const express = require("express");
const router = express.Router();
const moment = require("moment");
const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "vulnnode",
});

router.get("/user/:page", function (req, res, next) {
	var id = req.session.name;
	var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
	var sql = "select * from users order by _id desc"; // select 구절 그대로
	if (id !== "admin") {
		res.send(
			"<script>alert('관리자페이지는 관리자만 접근가능합니다.');history.back();</script>"
		);
	} else {
		connection.query(sql, function (err, rows) {
			if (err) console.log("err : " + err);
			res.render("admin_user", {
				rows: rows,
				page: page,
				length: rows.length - 1,
				page_num: 10,
				pass: true,
			});
			// length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
		});
	}
});

router.get("/user/delete/:idx", function (req, res) {
	var id = req.session.name;
	var idx = req.params.idx;
	connection.query(
		"SELECT * from users where _id=?",
		[idx],
		function (err, results) {
			if (id !== "admin") {
				res.send(
					"<script>alert('권한이 없습니다.');history.back();</script>"
				);
			} else {
				var sql = "DELETE FROM users WHERE _id = ?";
				connection.query(sql, [idx], function (err, results) {
					if (err) console.error("err : " + err);
					res.send(
						"<script>alert('회원 삭제가 완료되었습니다.');document.location.href='/admin/user/1';</script>"
					);
				});
			}
		}
	);
});

router.get("/board/:page", function (req, res, next) {
	var id = req.session.name;
	var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
	var sql = "select * from board order by _id desc"; // select 구절 그대로
	if (id !== "admin") {
		res.send(
			"<script>alert('관리자페이지는 관리자만 접근가능합니다.');history.back();</script>"
		);
	} else {
		connection.query(sql, function (err, rows) {
			if (err) console.log("err : " + err);
			res.render("admin_board", {
				rows: rows,
				page: page,
				length: rows.length - 1,
				page_num: 10,
				pass: true,
				moment,
				user: req.session.name,
			});
			// length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
		});
	}
});

router.get("/board/delete/:idx", function (req, res) {
	var id = req.session.name;
	var idx = req.params.idx;
	var path = __dirname + "/../" + "uploads/images/";
	connection.query(
		"SELECT * from board where _id=?",
		[idx],
		function (err, results) {
			if (id !== "admin") {
				res.send(
					"<script>alert('권한이 없습니다.');history.back();</script>"
				);
			} else {
				var sql = "DELETE FROM board WHERE _id = ?";
				var filename = results[0].filename;
				if (fs.existsSync(path + filename)) {
					fs.unlinkSync(path + filename);
				}
				connection.query(sql, [idx], function (err, results) {
					// 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
					if (err) console.error("err : " + err);
					res.send(
						"<script>alert('게시물 삭제가 완료되었습니다.');document.location.href='/admin/board/1';</script>"
					);
				});
			}
		}
	);
});

router.get("/service", function (req, res, next) {
	id = req.session.name;
	if (id !== "admin") {
		res.send(
			"<script>alert('관리자페이지는 관리자만 접근가능합니다.');history.back();</script>"
		);
	} else {
		res.render("admin_service");
	}
});
module.exports = router;
