const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");

//PRIVUTE ROUTES
router.get("/orders", orderController.getAll);
router.post("/orders/order/create", orderController.create);
router.get("/orders/order/:id", orderController.findOne);
router.put("/orders/:id", orderController.update);
router.delete("/orders/order/remove/:id", orderController.remove);
//PRIVUTE ROUTES
module.exports = router;