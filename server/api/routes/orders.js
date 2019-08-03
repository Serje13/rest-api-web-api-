const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");

//PRIVUTE ROUTES
router.get("/orders", orderController.getAll);
router.post("/orders/order/create", orderController.create);
router.get("/orders/order/:id", orderController.findOne);
router.put("/orders/order/remove/image", orderController.removeImage);
router.put("/orders/order/change/image", orderController.changeImage);
router.put("/orders/order/add/image", orderController.addImage);
router.delete("/orders/order/remove/:id", orderController.remove);
//PRIVUTE ROUTES
module.exports = router;