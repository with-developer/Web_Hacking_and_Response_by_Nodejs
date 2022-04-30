const express = require("express");
const { rmSync } = require("fs");
const router = express.Router();
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "vulnnode",
});

router.get("/", function (req, res) {
  // 2
  res.render("signup", { name: req.query.nameQuery });
});

router.post("/", (req, res) => {
  let id = req.body.id;
  let username = req.body.username;
  let password = req.body.password;
  let repassword = req.body.repassword;
  let email = req.body.email;
  let phoneNumber = req.body.phoneNumber;
  if (id && username && password && email && phoneNumber) {
    if (password != repassword) {
      res.send(
        "<script>alert('패스워드가 일치하지 않습니다.');history.go(-1);</script>"
      );
    } else if (
      id == "" ||
      username == "" ||
      password == "" ||
      repassword == "" ||
      email == "" ||
      phoneNumber == ""
    ) {
      res.send(
        "<script>alert('모든 값을 다 입력해주세요.');history.go(-1);</script>"
      );
    } else {
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [[id]],
        function (error, results, fields) {
          console.log("result.length");
          console.log(results.length);
          if (error) throw error;
          if (results.length >= 1) {
            console.log(results.length);
            res.send(
              "<script>alert('중복된 아이디입니다.');history.go(-1);</script>"
            );
          } else if (results.length == 0) {
            console.log(results.length);
            connection.query(
              "INSERT INTO users (id, password, username, email, phoneNumber) VALUES ?",
              [[[id, password, username, email, phoneNumber]]],
              function (error, results, fields) {
                if (error) throw error;
                if (results.affectedRows > 0) {
                  res.send(
                    "<script>alert('회원가입이 완료되었습니다.');document.location.href='/login';</script>"
                  );
                } else {
                  res.send(
                    "<script>alert('아이디와 이메일을 입력해주세요.');</script>"
                  );
                }
                res.end();
              }
            );
          }
        }
      );
    }
  } else {
    res.send("<script>alert('정보를 모두 입력해주세요.')</script>");
    res.end();
  }
});

router.post("/idcheck", (req, res) => {
  const { userid } = req.body;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [[id]],
    function (error, results, fields) {
      if (error) throw error;
      if (results.length == undefined || results.length < 1) {
        result = 1;
      }
      const resp = {
        result,
      };
      res.send(JSON.stringify(resp));
    }
  );
});

module.exports = router;
