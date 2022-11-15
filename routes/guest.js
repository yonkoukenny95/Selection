const express = require("express");
const router = express.Router();

const guestController = require("../controller/GuestController");

router.use("/submitAnswers", guestController.submitAnswers);
router.use("/getSurvey", guestController.getSurvey);
router.use("/", guestController.render);

module.exports = router;
