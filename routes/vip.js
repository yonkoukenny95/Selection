const express = require("express");
const router = express.Router();

const vipController = require("../controller/VIPController");

router.use("/submitAnswers", vipController.submitAnswers);
router.use("/", vipController.render);

module.exports = router;
