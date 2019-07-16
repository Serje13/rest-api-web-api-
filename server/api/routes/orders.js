const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");

//PRIVUTE ROUTES
router.get("/orders", orderController.getAll);
router.post("/orders", orderController.create);
router.get("/orders/:id", orderController.findOne);
router.put("/orders/:id", orderController.update);
router.delete("/orders/:id", orderController.remove);
//PRIVUTE ROUTES
module.exports = router;