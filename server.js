"use strict";
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const fs = require("fs");
const session = require("express-session");
var routes = require("./routes");

app.use(bodyParser.json());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "81236781627",
    cookie: {
      maxAge: returnSessionTime(),
    },
  })
);

const path = require("path");
const { fail } = require("assert");

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static("static"));

const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
routes(app);

function returnSessionTime() {
  let session = 30000;
  session = JSON.parse(fs.readFileSync("./settings.json")).sessionTime;
  return session;
}
