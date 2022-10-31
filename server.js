"use strict";
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

app.use(bodyParser.json());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "81236781627",
    cookie: { maxAge: 3000000 },
  })
);
const path = require("path");
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  if (req.session.Selection) {
    res.sendFile(__dirname + "/static/thankyou.html");
  } else {
    res.sendFile(__dirname + "/static/index.html");
  }
});

app.get("/VIP", (req, res) => {
  if (req.session.Selection) {
    res.sendFile(__dirname + "/static/thankyou.html");
  } else {
    res.sendFile(__dirname + "/static/vip.html");
  }
});

app.get("/login", (req, res) => {
  if (req.session && req.session.User) {
    res.redirect("/admin");
  } else {
    res.sendFile(__dirname + "/static/login.html");
  }
});

app.post("/auth", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == "admin" && password == "Thanhcong@678") {
    req.session.User = {
      username: "admin",
      website: "example.org.vn",
      type: "website javascript",
    };
    res.send("success");
  } else res.send("fail");
});

app.get("/logout", (req, res) => {
  req.session.User = null;
  res.redirect("/login");
});

app.get("/getSurvey", (req, res) => {
  fs.readFile("./data.json", (err, fileData) => {
    if (err) {
      console.log(err);
    }
    try {
      const jsonData = JSON.parse(fileData);
      let json = jsonData.filter(function (selection) {
        return selection.Public == true;
      });
      res.send(json);
    } catch (err) {
      console.log(err);
    }
  });
});

app.post("/submitAnswers", (req, res) => {
  let answers = req.body.answers;
  jsonReader("./data.json", (err, questionList) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }

    answers.forEach((element) => {
      let question = questionList.find(function (e) {
        return e.ID === element.questionID;
      });
      for (let i = 0; i < question.Answers.length; i++) {
        if (question.Answers[i].id == element.answerID) {
          question.Answers[i].vote += 1;
        }
      }
    });

    fs.writeFile("./data.json", JSON.stringify(questionList), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  });
  req.session.Selection = {
    questionID: answers,
  };
  res.send("success");
});

app.post("/submitVIPAnswers", (req, res) => {
  let answers = req.body.answers;
  jsonReader("./data.json", (err, questionList) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }

    answers.forEach((element) => {
      let question = questionList.find(function (e) {
        return e.ID === element.questionID;
      });
      for (let i = 0; i < question.Answers.length; i++) {
        if (question.Answers[i].id == element.answerID) {
          question.Answers[i].vote += 10;
        }
      }
    });

    fs.writeFile("./data.json", JSON.stringify(questionList), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  });
  req.session.Selection = {
    questionID: answers,
  };
  res.send("success");
});

const port = 3000;

app.listen(port, () => console.log(`This app is listening on port ${port}`));

//-------Admin Page-------------//

app.get("/admin", (req, res) => {
  if (req.session && req.session.User) {
    res.sendFile(__dirname + "/static/admin.html");
  } else {
    res.redirect("/login");
  }
});

app.get("/getListQuestions", (req, res) => {
  fs.readFile("./data.json", (err, fileData) => {
    if (err) {
      console.log(err);
    }
    try {
      const jsonData = JSON.parse(fileData);
      res.send(jsonData);
    } catch (err) {
      console.log(err);
    }
  });
});

app.post("/addQuestion", (req, res) => {
  let question = req.body.question;
  jsonReader("./data.json", (err, oldList) => {
    if (err) {
      console.log("Error reading file:", err);
      res.send("fail");
      return;
    }

    let questionObject = {
      ID: Date.now().toString(),
      Question: question,
      Answers: [],
      Public: true,
    };

    var newList = [...oldList, questionObject];

    fs.writeFile("./data.json", JSON.stringify(newList), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        res.send("fail");
      }
    });
  });
  res.send("success");
});

app.post("/deleteQuestion", (req, res) => {
  let questionId = req.body.questionId;
  jsonReader("./data.json", (err, oldList) => {
    if (err) {
      console.log("Error reading file:", err);
      res.send("fail");
      return;
    }
    let newList = oldList.filter(function (element) {
      return element.ID !== questionId;
    });
    fs.writeFile("./data.json", JSON.stringify(newList), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        res.send("fail");
      }
    });
  });
  res.send("success");
});

app.post("/publicQuestion", (req, res) => {
  let questionId = req.body.questionId;
  jsonReader("./data.json", (err, oldList) => {
    if (err) {
      console.log("Error reading file:", err);
      res.send("fail");
      return;
    }
    let question = oldList.find(function (element) {
      return element.ID == questionId;
    });
    question.Public = !question.Public;
    fs.writeFile("./data.json", JSON.stringify(oldList), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        res.send("fail");
      }
    });
  });
  res.send("success");
});

app.post("/addAnswer", (req, res) => {
  let answer = req.body.answer;
  let questionID = req.body.questionID;
  jsonReader("./data.json", (err, oldList) => {
    if (err) {
      console.log("Error reading file:", err);
      res.send("fail");
      return;
    }

    let answerObject = {
      id: Date.now().toString(),
      content: answer,
      vote: 0,
    };

    let question = oldList.find(function (element) {
      return element.ID == questionID;
    });
    question.Answers = [...question.Answers, answerObject];

    fs.writeFile("./data.json", JSON.stringify(oldList), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        res.send("fail");
      }
    });
  });
  res.send("success");
});

app.post("/deleteAnswer", (req, res) => {
  let answerID = req.body.answerID;
  let questionID = req.body.questionID;
  jsonReader("./data.json", (err, oldList) => {
    if (err) {
      console.log("Error reading file:", err);
      res.send("fail");
      return;
    }
    let question = oldList.find(function (element) {
      return element.ID === questionID;
    });

    question.Answers = question.Answers.filter(function (element) {
      return element.id !== answerID;
    });
    fs.writeFile("./data.json", JSON.stringify(oldList), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        res.send("fail");
      }
    });
  });
  res.send("success");
});
