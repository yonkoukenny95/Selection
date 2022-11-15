const fs = require("fs");
var helper = require("../helper/common");

class LoginController {
  renderLogin(req, res) {
    if (req.session && req.session.User) {
      res.redirect("/admin");
    } else {
      res.render("login", { layout: false });
    }
  }

  auth(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    helper.jsonReader("./settings.json", (err, setting) => {
      if (err) {
        console.log(err);
      }
      try {
        if (username === setting.username && password === setting.password) {
          req.session.User = {
            username: "admin",
            website: "example.org.vn",
            type: "website javascript",
          };
          req.session.cookie.expires = new Date(Date.now() + 600000);
          req.session.cookie.maxAge = 600000;
          res.send("success");
        } else res.send("fail");
      } catch (err) {
        console.log(err);
      }
    });
  }
}

module.exports = new LoginController();
