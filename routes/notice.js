const express = require("express");
const router = express.Router();
const moment = require("moment");
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "vulnnode",
});

router.get("/form_notice", function (req, res, next) {
	var id = req.session.name;

	if (id !== "admin") {
		res.send(
			"<script>alert('공지사항은 관리자만 작성 가능합니다.');history.back();</script>"
		);
	} else {
		res.render("form_notice", { user: req.session.name });
	}
});

router.post("/form_notice", function (req, res, next) {
	var title = req.body.title;
	var content = req.body.content;
	var id = req.session.name;

	if (id !== "admin") {
		res.send(
			"<script>alert('공지사항은 관리자만 작성 가능합니다.');history.back();</script>"
		);
	} else {
		connection.query(
			"insert into notice (title, content, author) VALUES ?",
			[[[title, content, id]]],
			function (err, results, fields) {
				if (err) console.log(err);
				res.send(
					"<script>alert('글 작성이 완료되었습니다.');document.location.href='/notice/page/1';</script>"
				);
			}
		);
	}
});

router.post("/comment_form_notice/:idx", function (req, res, next) {
	var content = req.body.content;
	var board_id = req.params.idx;
	var id = req.session.name;

	if (id === undefined) {
		res.send(
			"<script>alert('로그인 후 댓글을 작성하세요.');history.back();</script>"
		);
	} else {
		connection.query(
			"insert into notice_comment (board_id, content, author) VALUES ?",
			[[[board_id, content, id]]],
			function (err, results, fields) {
				if (err) console.log(err);
				console.log(results.affectedRows);
				if (results.affectedRows > 0) {
					res.send(
						"<script>alert('댓글 작성이 완료되었습니다.');location.href = document.referrer;</script>"
					);
				} else {
					res.send(
						"<script>alert('에러가 발생했습니다. 관리자에게 문의하세요 나문희');history.back();</script>"
					);
				}
			}
		);
	}
});

router.get("/read/:idx", function (req, res, next) {
	// board/read/idx숫자 형식으로 받을거
	var idx = req.params.idx; // :idx 로 맵핑할 req 값을 가져온다

	var sql = "SELECT * from notice where _id=?";
	var comment = "SELECT * from notice_comment where board_id=?";
	connection.query(sql, [idx], function (err, results) {
		// 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
		if (err) console.error("err : " + err);
		connection.query(comment, [idx], function (err, comment_results) {
			if (err) console.error("err : " + err);
			console.log(comment_results);
			res.render("read_notice", {
				title: "글 상세보기",
				results: results[0],
				user: req.session.name,
				comment_results: comment_results,
				length: comment_results.length - 1,
			}); // 첫번째행 한개의데이터만 랜더링 요청
		});
	});
});

router.get("/page/:page", function (req, res, next) {
	// 게시글 리스트에 :page가 추가된것임
	var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
	var sql = "select * from notice order by _id desc"; // select 구절 그대로
	var id = req.session.name;

	connection.query(sql, function (err, rows) {
		if (err) console.log("err : " + err);
		console.log(rows);
		res.render("page_notice", {
			rows: rows,
			page: page,
			length: rows.length - 1,
			page_num: 10,
			pass: true,
			moment,
			user: req.session.name,
		});
		// length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
		console.log(rows.length - 1);
	});
});

module.exports = router;
