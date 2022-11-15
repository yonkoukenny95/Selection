const express = require("express");
const router = express.Router();

const loginController = require("../controller/LoginController");

router.use("/auth", loginController.auth);
router.use("/", loginController.renderLogin);

module.exports = router;
