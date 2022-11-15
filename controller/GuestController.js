var helper = require("../helper/common");
const fs = require("fs");

class GuestController {
  render(req, res) {
    console.log("index");
    if (req.session.Selection) {
      res.render("thanks", { layout: false });
    } else {
      res.render("guest", { layout: false });
    }
  }

  getSurvey(req, res) {
    console.log("getSurvey");
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
  }

  submitAnswers(req, res) {
    console.log("submitAnswers");
    let answers = req.body.answers;
    helper.jsonReader("./data.json", (err, questionList) => {
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
  }
}

module.exports = new GuestController();
