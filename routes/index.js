const AdminRouter = require("./admin");
const GuestRouter = require("./guest");
const VIPRouter = require("./vip");
const LoginRouter = require("./login");

function route(app) {
  app.use("/guest", GuestRouter);
  app.use("/vip", VIPRouter);
  app.use("/login", LoginRouter);
  app.use("/admin", AdminRouter);
  //default if index
  app.use("/", GuestRouter);
}

module.exports = route;
