var helper = require("../helper/common");
const fs = require("fs");

class AdminController {
  index(req, res) {
    if (req.session && req.session.User) {
      res.render("admin", { layout: false });
    } else {
      res.redirect("/login");
    }
  }

  logout(req, res) {
    req.session.User = null;
    res.redirect("/login");
  }

  getListQuestions(req, res) {
    console.log("getListQuestion");
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
  }

  addQuestion(req, res) {
    let question = req.body.question;
    helper.jsonReader("./data.json", (err, oldList) => {
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
  }
  deleteQuestion(req, res) {
    let questionId = req.body.questionId;
    helper.jsonReader("./data.json", (err, oldList) => {
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
  }

  addAnswer(req, res) {
    let answer = req.body.answer;
    let questionID = req.body.questionID;
    helper.jsonReader("./data.json", (err, oldList) => {
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
  }

  deleteAnswer(req, res) {
    let answerID = req.body.answerID;
    let questionID = req.body.questionID;
    helper.jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send("fail");
        return;
      }
      let question = oldList.find(function (element) {
        return element.ID === questionID;
      });
      //console.log(question);
      question.Answers = question.Answers.filter(function (element) {
        return element.id !== answerID;
      });
      //console.log(question);
      fs.writeFile("./data.json", JSON.stringify(oldList), (err) => {
        if (err) {
          console.log("Error writing file:", err);
          res.send("fail");
        }
      });
    });
    res.send("success");
  }

  publicQuestion(req, res) {
    let questionId = req.body.questionId;
    helper.jsonReader("./data.json", (err, oldList) => {
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
  }
}

module.exports = new AdminController();
