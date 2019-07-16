const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email");

//PRIVATE ROUTES
router.post("/:_id/:token", emailController.receiveNewPassword);
//PRIVATE ROUTES

module.exports = router;