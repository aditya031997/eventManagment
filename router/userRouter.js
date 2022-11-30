const express = require('express')
const router = express.Router();
const validator = require("../utils/validator");
const {userAuth}  = require('../middleware/auth');
const userController = require("../controller/frontend/userController")
const { check } = require("express-validator");

router.post("/register", 
[
    check("firstName").not().isEmpty().withMessage("first_name field is required"),
    check("lastName").not().isEmpty().withMessage("last_name field is required"),
    check("email").not().isEmpty().withMessage("email field is required"),
    check("phoneNumber").not().isEmpty().withMessage("phonenumber field is required"),
    check("password").not().isEmpty().withMessage("password field is required"),

  ],
  validator,userController.register)

  router.post("/login",userController.login)
  router.post("/adminLogin",userController.adminLogin)
  router.post("/forgot",userController.forgetPassword)
  router.put("/resetPassword",userController.resetPassword)
  router.put("/changePassword",userAuth,userController.changePassword)





module.exports = router;