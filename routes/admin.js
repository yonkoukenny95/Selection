const express = require("express");
var router = express.Router();

var adminController = require("../controller/AdminController");

router.use("/getListQuestions", adminController.getListQuestions);
router.use("/addQuestion", adminController.addQuestion);
router.use("/deleteQuestion", adminController.deleteQuestion);
router.use("/addAnswer", adminController.addAnswer);
router.use("/deleteAnswer", adminController.deleteAnswer);
router.use("/publicQuestion", adminController.publicQuestion);
router.use("/logout", adminController.logout);
router.use("/", adminController.index);

/*
app.get('/admin', (req, res) => {
    console.log(req.session);
    if(req.session && req.session.User){
      res.sendFile(__dirname + '/static/admin.html');
    } else {
      res.redirect('/login');
    } 
});

app.get('/getListQuestions', (req, res) => {
    fs.readFile('./data.json', (err, fileData) => {
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
  })
  
  app.post('/addQuestion', (req, res) => {
    let question = req.body.question;
    jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
  
      let questionObject = {
        ID: Date.now().toString(),
        Question: question,
        Answers: [],
        Public: true
      };
  
      var newList = [...oldList, questionObject];
  
      fs.writeFile("./data.json", JSON.stringify(newList), err => {
        if (err) {
          console.log("Error writing file:", err);
        res.send('fail');
        }
      });
    });
    res.send('success');
  });
  
  app.post('/deleteQuestion', (req, res) => {
    //console.log(req.body.questionId);
    let questionId = req.body.questionId;
    jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
      let newList = oldList.filter(function(element){
        return element.ID !== questionId;
      })
      fs.writeFile("./data.json", JSON.stringify(newList), err => {
        if (err) {
          console.log("Error writing file:", err);
        res.send('fail');
        }
      });
    });
    res.send('success');
  });
  
  app.post('/publicQuestion', (req, res) => {
    //console.log(req.body.questionId);
    let questionId = req.body.questionId;
    jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
      let question = oldList.find(function(element){
        return element.ID == questionId;
      })
      question.Public = !question.Public;
      fs.writeFile("./data.json", JSON.stringify(oldList), err => {
        if (err) {
          console.log("Error writing file:", err);
        res.send('fail');
        }
      });
    });
    res.send('success');
  });
  
  
  app.post('/addAnswer', (req, res) => {
    //console.log(req.body);
    let answer = req.body.answer;
    let questionID = req.body.questionID;
    jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
  
      let answerObject = {
        id: Date.now().toString(),
        content: answer,
        vote: 0
      };
  
      let question = oldList.find(function(element){
        return element.ID == questionID;
      })
      question.Answers = [...question.Answers,answerObject];
  
      fs.writeFile("./data.json", JSON.stringify(oldList), err => {
        if (err) {
          console.log("Error writing file:", err);
        res.send('fail');
        }
      });
    });
    res.send('success');
  });
  
  app.post('/deleteAnswer', (req, res) => {
    let answerID = req.body.answerID;
    let questionID = req.body.questionID;
    jsonReader("./data.json", (err, oldList) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
      let question = oldList.find(function(element){
        return element.ID === questionID;
      })
      //console.log(question);
      question.Answers = question.Answers.filter(function(element){
        return element.id !== answerID;
      })
      //console.log(question);
      fs.writeFile("./data.json", JSON.stringify(oldList), err => {
        if (err) {
          console.log("Error writing file:", err);
        res.send('fail');
        }
      });
    });
    res.send('success');
  });
  
  app.post('/changePassword', (req, res) => {
    let username = req.body.username;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let repassword = req.body.repassword;
    jsonReader("./settings.json", (err, setting) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
      if(newpassword !== repassword){res.send({status:"fail",message:"Mật khẩu mới và mật khẩu xác nhận không khớp" });}
      if(username !== setting.username){res.send({status:"fail",message:"Username không hợp lệ" });}
      if(oldpassword !== setting.password){res.send({status:"fail",message:"Mật khẩu cũ không chính xác" });}
      else 
      {
        setting.password = newpassword;
        fs.writeFile("./settings.json", JSON.stringify(setting), err => {
          if (err) {
            console.log("Error writing file:", err);
            res.send({status:"fail",message:"Không thể đổi được mật khẩu" });
          }
        });
        res.send({status:"success",message:"Đổi mật khẩu thành công" });
      }
    });
  });
  
  app.post('/changeSessionTime', (req, res) => {
    let sessionTime = req.body.sessionTime;
    jsonReader("./settings.json", (err, setting) => {
      if (err) {
        console.log("Error reading file:", err);
        res.send('fail');
        return;
      }
        setting.sessionTime = sessionTime;
        fs.writeFile("./settings.json", JSON.stringify(setting), err => {
          if (err) {
            console.log("Error writing file:", err);
            res.send({status:"fail",message:"Không thể đổi được thời gian chờ" });
          }
        });
        req.session.cookie.expires = false;
        req.session.cookie.maxAge = sessionTime * 60 * 1000;
        res.send({status:"success",message:"Đổi thời gian chờ thành công" });
    })
});

*/

module.exports = router;
