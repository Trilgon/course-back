const Router = require("express");
const express = require("express");



const urlencodedParser = express.urlencoded({ extended: false });

const router = new Router();

const userController = require("../controllers/user.controllers");

router.post("/auth", urlencodedParser, userController.userAuth);
router.get("/empInf", userController.empInf);
router.post("/addEmp", userController.addEmp);
router.get("/logOut", urlencodedParser, userController.logOut);

module.exports = router;
