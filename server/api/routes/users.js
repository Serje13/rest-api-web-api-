const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

//PUBLIC ROUTES
router.get("/allusers", userController.getAll);
router.get("/user/:id", userController.findOne);
router.post("/register/user", userController.create);
router.post("/authenticate/user", userController.authenticate);
router.post("/password/forgot/user", userController.forgotPassword);
//PUBLIC ROUTES


//PRIVATE ROUTES
router.delete("/users/remove/user/:id", userController.remove);
router.put("/users/update/user", userController.updateUserInfo);
router.post("/users/logout/user", userController.logOut);
//PRIVATE ROUTES

module.exports = router;