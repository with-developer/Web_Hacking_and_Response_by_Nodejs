const express = require("express");
const router = express.Router();
const mysql = require("mysql2"); // db 폴더를 만들어서 conn 과 info 를 만들어 코드의 길이를 최대한줄일수도있다고한다

const connection = mysql.createConnection({
	// createConnection 데이터베이스 설정 입력
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "vulnnode",
});

router.get("/list", function (req, res, next) {
	// list/1 이 아니라  /list 로만 라우팅됫을때 /list/1 로 보내준다
	res.redirect("/board/list/1");
});

router.get("/list/:page", function (req, res, next) {
	// board/list/page숫자 형식으로 받을거
	var page = req.params.page; // :page 로 맵핑할 req 값을 가져온다
	var sql =
		"SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, hit, " +
		"date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board";
	connection.query(sql, function (err, rows) {
		// select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
		if (err) console.error("err : " + err);
		if (req.session.loggedin == true) {
			res.render("list.ejs", { title: "게시판 리스트", rows: rows });
		} else {
			res.send(
				"<script>alert('로그인 해주세요!!');history.go(-1);</script>"
			);
		}
	});
});

router.get("/write", function (req, res, next) {
	// board/write 로 접속하면 글쓰기페이지로 이동
	res.render("write", { title: "게시판 글쓰기" });
});

router.post("/write", function (req, res, next) {
	var name = req.body.name;
	var title = req.body.title;
	var content = req.body.content;
	var passwd = req.body.passwd;
	var datas = [name, title, content, passwd]; // 모든데이터를 배열로 묶기
	// req 객체로 body 속성에서 input 파라미터 가져오기
	var sql =
		"insert into board(name, title, content, regdate, modidate, passwd,hit) values(?,?,?,now(),now(),?,0)"; // ? 는 매개변수
	connection.query(sql, datas, function (err, rows) {
		// datas 를 매개변수로 추가
		if (err) console.error("err : " + err);
		res.redirect("/board/list");
	});
});

router.get("/read/:idx", function (req, res, next) {
	// board/read/idx숫자 형식으로 받을거
	var idx = req.params.idx; // :idx 로 맵핑할 req 값을 가져온다
	var sql =
		"SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +
		"date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from board where idx=?";
	connection.query(sql, [idx], function (err, rows) {
		// 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
		if (err) console.error("err : " + err);
		res.render("read", { title: "글 상세보기", rows: rows[0] }); // 첫번째행 한개의데이터만 랜더링 요청
	});
});

router.post("/update", function (req, res, next) {
	var idx = req.body.idx;
	var name = req.body.name;
	var title = req.body.title;
	var content = req.body.content;
	var passwd = req.body.passwd;
	var datas = [idx, name, title, content, passwd]; // 변수설정한 값을 datas 에 배열화

	var sql =
		"UPDATE board set name=?, title=?, content=? ,modidate=now() where idx=? and passwd=?"; // id 값과 비밀번호를 조건절로 걸엇음
	connection.query(sql, datas, function (err, result) {
		if (err) console.error(err);
		if (result.affectedRows == 0) {
			//affectedRows  해당쿼리로 변경된수의 행 불러오기 0이면 업데이트 되지않으므로 비밀번호가 틀린것임
			res.send(
				"<script>alert('비밀번호가 일치하지않습니다');history.back();</script>"
			);
		} else {
			res.redirect("/board/read/" + idx);
		}
	});
});

router.get("/page/:page", function (req, res, next) {
	// 게시글 리스트에 :page가 추가된것임
	var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
	var sql =
		"select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
		"date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board"; // select 구절 그대로

	connection.query(sql, function (err, rows) {
		if (err) console.err("err : " + err);
		res.render("page", {
			title: "글목록",
			rows: rows,
			page: page,
			length: rows.length - 1,
			page_num: 10,
			pass: true,
		});
		// length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
		console.log(rows.length - 1);
	});
});

router.post("/delete", function (req, res, next) {
	var idx = req.body.idx;
	var passwd = req.body.passwd;
	var datas = [idx, passwd];

	var sql = "delete from board where idx=? and passwd=?"; // 업데이트 수정과 거의 비슷한 쿼리문
	connection.query(sql, datas, function (err, result) {
		if (err) console.error(err);
		if (result.affectedRows == 0) {
			res.send(
				"<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>"
			);
		} else {
			res.redirect("/board/list");
		}
	});
});
// 삭제기능은 수정기능과 거의 비슷함
module.exports = router;
