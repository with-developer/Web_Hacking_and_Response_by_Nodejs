const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const path = require("path");
const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "vulnnode",
});

router.get("/", (req, res) => {
  res.render("findPW", { user: req.session.name });
});

router.post("/", (req, res) => {
  let id = req.body.id;
  let email = req.body.email;
  if (id && email) {
    connection.query(
      "SELECT * FROM users WHERE id = ? AND email = ?",
      [id, email],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          let password = results[0].password;
          res.send(
            "<script>alert('메일이 전송되었습니다.');history.go(-2);</script>"
          );
          const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
              user: "nodeapp000@gmail.com",
              pass: process.env.GMAIL_PW,
            },
          });
          const emailOptions = {
            from: "nodeapp000@gmail.com",
            to: email,
            subject: "Binding에서 비밀번호를 알려드립니다.",
            html:
              "<h1 >Binding에서 " +
              id +
              "님의 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " +
              password +
              "</h2>",
          };
          transporter.sendMail(emailOptions, res); //전송
        } else {
          res.send("Username이 맞지 않습니다.");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Email!!");
    res.end();
  }
});

module.exports = router;
