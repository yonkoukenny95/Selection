class VIPController {
  render(req, res) {
    console.log("index");
    if (req.session.Selection) {
      res.render("thanks", { layout: false });
    } else {
      res.render("vip", { layout: false });
    }
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
  }
}

module.exports = new VIPController();
