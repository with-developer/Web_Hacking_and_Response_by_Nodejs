const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
const { NULL } = require("mysql/lib/protocol/constants/types");

require("dotenv").config();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "vulnnode",
});

router.get("/", function (req, res) {
  let id = req.session.name;

  if (id == undefined) {
    res.send(
      "<script>alert('로그인 후 프로필을 확인하세요.');history.back();</script>"
    );
  } else {
    let password_check;
    if (password_check == undefined || password_check == "NO") {
      password_check = "NO";
      console.log(password_check);
      res.render("profile", {
        password_check: password_check,
        user: req.session.name,
      });
    } else if (password_check == true) {
      connection.query(
        "select * from users where id = ? ",
        [[[id]]],
        function (error, results, field) {
          if (error) {
            throw error;
          }

          if (results.length == 0) {
            res.send(
              '<script>alert("로그인 후 프로필을 확인하세요.");location.href="/";</script>'
            );
          } else {
            password_check = "YES";
            console.log(password_check);
            res.render("profile", {
              password_check: password_check,
              userinfo: results[0],
              user: req.session.name,
            });
          }
        }
      );
    }
  }
});

router.post("/", function (req, res) {
  let id = req.session.name;
  let password = req.body.password;
  let password_check;
  connection.query(
    "SELECT * FROM users WHERE id = ? AND password = " + `'${password}'`,
    [id, password],
    function (error, results, fields) {
      if (results == undefined) {
        res.send(error);
      } else if (results.length > 0) {
        password_check = "YES";
        console.log(password_check);
        res.render("profile", {
          password_check: password_check,
          userinfo: results[0],
          user: req.session.name,
        });
      } else {
        password_check = "NO";
        res.send(
          '<script>alert("패스워드가 일치하지 않습니다.");location.href="/profile";</script>'
        );
      }
      res.end();
    }
  );
});

router.post("/resetpw", function (req, res) {
  let id = req.session.name;
  let password_1 = req.body.password_1;
  let password_2 = req.body.password_2;
  console.log(password_1);
  if (password_1 != password_2) {
    res.send(
      "<script>alert('패스워드가 일치하지 않습니다.');document.location.href='/profile';</script>"
    );
  } else if (password_1 == "") {
    res.send(
      "<script>alert('패스워드를 입력해주세요.');document.location.href='/profile';</script>"
    );
  } else {
    connection.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [password_1, id],
      function (err, results, fields) {
        if (err) console.log(err);
        res.send(
          "<script>alert('패스워드 변경이 완료되었습니다.');document.location.href='/profile';</script>"
        );
      }
    );
  }
});

router.get("/secession", function (req, res) {
  let id = req.session.name;
  connection.query(
    "delete from users where id=?",
    [id],
    function (err, results) {
      if (err) console.error("err : " + err);
      if (results.affectedRows > 0) {
        req.session.destroy(function (err) {
          if (err) {
            console.error("err", err);
          } else {
            res.send(
              '<script>alert("회원 탈퇴가 완료되었습니다. 닦다를 이용해주셔서 감사합니다.");location.href="/";</script>'
            );
          }
        });
      } else {
        res.send(
          "<script>alert('에러가 발생했습니다.');history.back();</script>"
        );
      }
    }
  );
});

module.exports = router;
