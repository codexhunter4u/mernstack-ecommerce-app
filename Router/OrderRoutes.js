import express from "express";
const router = express.Router();
import { isAdmin, requireSignIn } from "../Middleware/AuthMiddleware.js";
import {
  BraintreeToken,
  OderPayment,
  getOrderByUser,
  getAllOrders,
  getOrderStatus,
} from "../Controller/OrderController.js";

// Get braintree token List [GET]
router.get("/braintree/token", BraintreeToken);

// Get braintree token List [GET]
router.post("/braintree/payment", requireSignIn, OderPayment);

// Get all orders
router.get("/orders", requireSignIn, getOrderByUser);

//all orders
router.get("/all-orders", requireSignIn, getAllOrders);

// order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, getOrderStatus);

export default router;
