const express = require('express')
const router = express.Router();
const validator = require("../utils/validator");
const {userAuth}  = require('../middleware/auth');
const eventController = require("../controller/frontend/eventController")
const { check } = require("express-validator");
const upload = require("../middleware/multer")

router.post("/addEvent",upload.single('image'), userAuth,
[
    check("name").not().isEmpty().withMessage("name field is required"),
    check("date").not().isEmpty().withMessage("date field is required"),
    check("type").not().isEmpty().withMessage("type field is required"),
    check("price").not().isEmpty().withMessage("price field is required"),
    check("info").not().isEmpty().withMessage("info field is required"),

  ],
  validator,eventController.addEvent)
  router.get("/freeEvent",eventController.getFreeEvent)
  router.get("/proEvent",userAuth,eventController.getProEvent)

module.exports = router;