const express = require("express");
const router = express.Router();
const path = require("path");



router.get('/', function(req,res){ // 2
	res.render('main', {user: req.session.name});
  });



module.exports = router;
