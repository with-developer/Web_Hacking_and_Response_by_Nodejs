const express = require("express"); // require로 express 사용하겠음
const router = express.Router(); // express 프레임워크 라우터를 사용하기위해 변수선언

router.get("/", function (req, res, next) {
	// 라우터는 URI 요청에 응답하는 방식을 말함
	res.render("form", {
		name: "보더코딩", // ejs 파일 의 <%%> 태그안에 담길 변수들
		blog: "보더코딩의 블로그",
		homepage: "보더코딩의 홈페이지",
	}); // res.render 는 해당 'view' 파일을 지정할수잇음
});

router.post("/", function (req, res, next) {
	// post 요청에 응당하는 router
	res.json(req.body); // 요청받은데이터를 json 함수로 response 하겟음
});

module.exports = router; // 전역으로 해당 라우터를 사용하게해줌
