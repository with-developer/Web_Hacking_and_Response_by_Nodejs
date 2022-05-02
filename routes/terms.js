const express = require("express");
const router = express.Router();
const path = require("path");



router.get('/terms-inside', function (req, res) { // 2
    res.render('terms-inside', { user: req.session.name });
});

router.get('/terms-persnal', function (req, res) { // 2
    res.render('terms-persnal', { user: req.session.name });
});


module.exports = router;