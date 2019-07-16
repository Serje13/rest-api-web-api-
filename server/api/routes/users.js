const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

//PUBLIC ROUTES
router.get("/", userController.getAll);
router.get("/user/:id", userController.findOne);
router.post("/user/register", userController.create);
router.post("/user/authenticate", userController.authenticate);
router.post("/user", userController.forgotPassword);
//PUBLIC ROUTES


//PRIVATE ROUTES
router.delete("/user/:id", userController.remove);
router.put("/user/name_email", userController.updateUserInfo);
router.post("/user/logout", userController.logOut);
//PRIVATE ROUTES

module.exports = router;