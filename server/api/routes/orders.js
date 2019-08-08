const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");
const {authorizeAdmin} = require("../modules/auth/authorization");

//PRIVUTE ROUTES
//FOR ALL USERS
router.get("/orders", orderController.getAll);
router.get("/orders/order/:id", orderController.findOne);
//FOR ALL USERS

//FOR ADMIN
router.post("/orders/order/create", authorizeAdmin, orderController.create);
router.put("/orders/order/add/images", authorizeAdmin, orderController.addImages);
router.put("/orders/order/update/order_id", authorizeAdmin, orderController.updateOrderId);
router.put("/orders/order/remove/image", authorizeAdmin, orderController.removeImage);
router.put("/orders/order/update/image", authorizeAdmin, orderController.updateImage);
router.put("/orders/order/add/image", authorizeAdmin, orderController.addImage);
router.delete("/orders/order/remove/:id", authorizeAdmin, orderController.remove);
//FOR ADMIN
//PRIVUTE ROUTES
module.exports = router;