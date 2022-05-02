const https = require("https");
const http = require("http");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const ejs = require("ejs");
const moment = require("moment");

const options = {
  key: fs.readFileSync("fake_keys/key.pem"),
  cert: fs.readFileSync("fake_keys/cert.pem"),
};

const app = express();

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);


const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const resetpwRouter = require("./routes/resetpw");
const logoutRouter = require("./routes/logout");
const inforoverviewRouter = require("./routes/infor-overview");
const inforhistoryRouter = require("./routes/infor-history");
const inforrecruitRouter = require("./routes/infor-recruit");
const noticeRouter = require("./routes/notice");
const profileRouter = require("./routes/profile");
const pageRouter = require("./routes/board");
const serviceRouter = require("./routes/service");
const adminRouter = require("./routes/admin");
const findPWRouter = require("./routes/findPW");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
http.createServer(app).listen(8080);
https.createServer(options, app).listen(8443); //chrome://flags/#allow-insecure-localhost 설정 필요

app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/resetpw", resetpwRouter);
app.use("/logout", logoutRouter);
app.use("/infor-overview", inforoverviewRouter);
app.use("/infor-history", inforhistoryRouter);
app.use("/infor-recruit", inforrecruitRouter);
app.use("/notice", noticeRouter);
app.use("/profile", profileRouter);
app.use("/board", pageRouter);
app.use("/service", serviceRouter);
app.use("/admin", adminRouter);
app.use("/findPW", findPWRouter);
