const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "vulnnode",
});

router.get("/", function (req, res) {
  // 2
  let id = req.session.name;

  connection.query(
    "select * from users where id = ? ",
    [[[id]]],
    function (error, results, field) {
      if (error) {
        throw error;
      }
      if (results.length == 0) {
        res.send(
          "<script>alert('로그인 후 서비스를 접속하세요.');history.back();</script>"
        );
      } else {
        res.render("service", {
          userinfo: results[0],
          user: req.session.name,
        });
      }
    }
  );
});

router.post("/", function (req, res) {
  let id = req.session.name;
  let date = req.body.date;
  let service_1 = req.body.service_1;
  let service_2 = req.body.service_2;
  let service_3 = req.body.service_3;
  let service_4 = req.body.service_4;
  let comment = req.body.comment;
  connection.query(
    "select * from users where id = ? ",
    [[[id]]],
    function (error, results, field) {
      if (error) {
        throw error;
      }
      if (results.length == 0) {
        res.send(
          "<script>alert('로그인 후 신청을 하세요.');history.back();</script>"
        );
      } else {
        if (service_1 != undefined) {
          service_1 = 1;
        } else {
          service_1 = 0;
        }
        if (service_2 != undefined) {
          service_2 = 1;
        } else {
          service_2 = 0;
        }
        if (service_3 != undefined) {
          service_3 = 1;
        } else {
          service_3 = 0;
        }
        if (service_4 != undefined) {
          service_4 = 1;
        } else {
          service_4 = 0;
        }
        phonenumber = results[0].phonenumber;

        connection.query(
          "INSERT INTO service (id, phonenumber, date, service_1, service_2, service_3, service_4, comment) VALUES ?",
          [
            [
              [
                id,
                phonenumber,
                date,
                service_1,
                service_2,
                service_3,
                service_4,
                comment,
              ],
            ],
          ],
          function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows > 0) {
              res.send(
                "<script>alert('서비스 예약이 완료되었습니다.');document.location.href='/service';</script>"
              );
            } else {
              res.send(
                "<script>alert('에러가 발생했습니다. 다시 입력하세요.');history.back(-1);</script>"
              );
            }
            res.end();
          }
        );
      }
    }
  );
});

module.exports = router;
