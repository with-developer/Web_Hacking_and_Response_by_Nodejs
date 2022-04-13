const express = require("express");
const router = express.Router();


router.get('/', function(req,res){ // 2
	req.session.destroy(function(err){
        if(err) console.error('err', err);
        res.send('<script>alert("로그아웃 되었습니다!");location.href="/";</script>');
    });
    req.session.destory();  // 세션 삭제
    res.clearCookie('sid'); // 세션 쿠키 삭제
  });

module.exports = router;
