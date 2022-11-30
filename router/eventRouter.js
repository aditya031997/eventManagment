const express = require('express')
const router = express.Router();
const validator = require("../utils/validator");
const {userAuth}  = require('../middleware/auth');
const eventController = require("../controller/frontend/eventController")
const { check } = require("express-validator");

router.post("/uploadEvent", userAuth,
[
    check("name").not().isEmpty().withMessage("name field is required"),
    check("image").not().isEmpty().withMessage("image field is required"),
    check("date").not().isEmpty().withMessage("date field is required"),
    check("type").not().isEmpty().withMessage("type field is required"),
    check("price").not().isEmpty().withMessage("price field is required"),
    check("info").not().isEmpty().withMessage("info field is required"),

  ],
  validator,eventController.addEvent)

module.exports = router;