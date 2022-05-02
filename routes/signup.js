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


const filterSQL = [
  "CREATE",
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "create",
  "insert",
  "update",
  "delete",
  "drop",
  "alter"
];

const filterXSS = [
  "script",
  "<",
  "&lt",
  "&gt",
  ">",
  "\"",
  "&quot",
  "\'",
  "&#x27",
  "\`",
  "\\",
  "&#x2F"
];

router.get("/policy", function (req, res) {
  res.render("policy", { user: req.session.name });
});


router.get("/", function (req, res) {
  res.render("signup", { user: req.session.name });
});



router.post("/", (req, res) => {
  function validatePassword(character) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/.test(character);
    // 패스워드 검증: 영문,숫자,특수문자로 이루어진 6자리 이상 20자리 미만 패스워드
  }
  function validateid(character) {
    return /^[a-z]+[a-z0-9]{2,13}$/.test(character);
  }

  function validatename(character) {
    return /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]*$/.test(character);
  }

  function validateemail(character) {
    return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/.test(character);
  }

  function validatephonenumber(character) {
    return /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/.test(character);
  }


  let id = req.body.id;
  let username = req.body.username;
  let password = req.body.password;
  let repassword = req.body.repassword;
  let email = req.body.email;
  let phoneNumber = req.body.phoneNumber;
  attack = 0;

  if (validateid(id)) {
    validate_id = "YES";
  } else {
    validate_id = "NO";
  }

  if (validatename(username)) {
    validate_username = "YES";
  } else {
    validate_username = "NO";
  }

  if (validatePassword(password)) {
    validate_password = "YES";
  } else {
    validate_password = "NO";
  }

  if (validateemail(email)) {
    validate_email = "YES";
  } else {
    validate_email = "NO";
  }

  if (validatephonenumber(phoneNumber)) {
    validate_phonenumber = "YES";
  } else {
    validate_phonenumber = "NO";
  }

  for (var i = 0; i < filterSQL.length; i++) {
    if (username.includes(filterSQL[i])) {
      attack = 1;
    }
    if (id.includes(filterSQL[i])) {
      attack = 1;
    }
    if (password.includes(filterSQL[i])) {
      attack = 1;
    }
    if (repassword.includes(filterSQL[i])) {
      attack = 1;
    }
    if (email.includes(filterSQL[i])) {
      attack = 1;
    }
    if (phoneNumber.includes(filterSQL[i])) {
      attack = 1;
    }
  }

  for (var i = 0; i < filterXSS.length; i++) {
    if (username.includes(filterXSS[i])) {
      attack = 1;
    }
    if (id.includes(filterXSS[i])) {
      attack = 1;
    }
    if (password.includes(filterXSS[i])) {
      attack = 1;
    }
    if (repassword.includes(filterXSS[i])) {
      attack = 1;
    }
    if (email.includes(filterXSS[i])) {
      attack = 1;
    }
    if (phoneNumber.includes(filterXSS[i])) {
      attack = 1;
    }
  }



  if (id && username && password && email && phoneNumber) {
    if (attack == 1) {

      res.send(
        "<script>alert('공격하지마세요!!');history.back(-1);</script>"
      );
    }
    else if (password != repassword) {
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
    } else if (validate_id == "NO" || id.length >= 13) {
      res.send(
        "<script>alert('아이디를 정책에 맞게 입력해주세요');history.go(-1);</script>"
      );
    } else if (validate_username == "NO" || username.length >= 15) {
      res.send(
        "<script>alert('이름을 정책에 맞게 입력해주세요');history.go(-1);</script>"
      );
    } else if (validate_password == "NO" || password.length >= 30) {
      res.send(
        "<script>alert('패스워드를 정책에 맞게 입력해주세요');history.go(-1);</script>"
      );
    }
    else if (validate_email == "NO" || email.length >= 30) {
      res.send(
        "<script>alert('이메일을 정책에 맞게 입력해주세요.');history.go(-1);</script>"
      );
    } else if (validate_phonenumber == "NO" || phoneNumber.length >= 16) {
      res.send(
        "<script>alert('전화번호를 정책에 맞게 입력해주세요.');history.go(-1);</script>"
      );
    } else {
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [[id]],
        function (error, results, fields) {
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
