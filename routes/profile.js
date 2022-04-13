const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "sos7136@",
    database: "vulnnode",
});


router.get('/', function (req, res) {
    let id = req.session.name;
    console.log(id)

    connection.query("select * from users where id = ? ", [[[id]]], function (error, results, field) {
        if (error) { throw error; }

        if(results.length == 0)
        {
            res.send(
                "<script>alert('로그인 후 프로필을 확인하세요.');history.back();</script>"
            );
        }
        else {
            console.log(results)
            res.render('profile', {userinfo: results[0], user: req.session.name });
            
        }
    }
    );

    //res.render('profile', {name: req.session.name, id: req.session.id, test: test});
});



module.exports = router;

