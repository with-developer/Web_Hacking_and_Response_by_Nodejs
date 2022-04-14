const express = require("express"); // require로 express 사용하겠음
const router = express.Router(); // express 프레임워크 라우터를 사용하기위해 변수선언
const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "sos7136@",
	database: "vulnnode",
});

router.get("/", function (req, res, next) {
	res.render("form", { user: req.session.name });
});

router.post("/", function (req, res, next) {
	var title = req.body.title;
	var content = req.body.content;
	var id = req.session.name;

	console.log(title)
	console.log(content)
	console.log(id)

	if (id === undefined) {
		res.send(
			"<script>alert('로그인 후 게시글을 작성하세요.');history.back();</script>"
		);
	}
	else {
		connection.query("insert into board (title, content, author) VALUES ?",
			[[[title, content, id]]],
			function (err, results, fields) {
				if (err) console.log(err);
				res.send(
					"<script>alert('글 작성이 완료되었습니다.');history.back();</script>"
				);
			});
	}


});


module.exports = router;
