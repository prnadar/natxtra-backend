const jwt = require("jsonwebtoken");
const Order = require("../../models/Order");
const OrderHistory = require("../../models/OrderHistory");
const WebUser = require("../../models/WebUser");
const Transaction = require("../../models/Transaction");
const Product = require("../../models/Product");
const UserBillingAddress = require("../../models/UserBillingAddress");
const initializeRazorpay = require("../../config/razorpay");

class PaymentController {
  static createOrder = async (req, res) => {
    try {
      const { items, billing_address } = req.body;
      const { authorization } = req.headers;

      if (authorization == null)
        return res.status(401).send({
          message: "please check authorization",
        });
      const token = authorization.replace("Bearer ", "");
      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      if (payload == null)
        return res.status(401).send({
          message: "token is required",
        });

      const user = await WebUser.findById(payload.id);
      if (!user) return res.status(401).send("User not found");
      req.login_web_user = user;

      let totalAmount = 0;
      let subTotal = 0;
      let rawOrderItems = [];

      for (let item of items) {
        // Validate required fields
        if (!item.product_id || !item.quantity) {
          return res.status(400).send({
            key: !item.product_id ? "product_id" : "quantity",
            message: !item.product_id
              ? "product_id is required"
              : "quantity is required",
          });
        }

        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(400).send({
            message: "Product not found",
          });
        }

        // Calculate amount
        item.amount = item.quantity * item.mrp;
        totalAmount += item.amount;
        subTotal += item.amount;

        rawOrderItems.push({
          product,
          item,
          amount: item.amount,
        });
      }

      let razorpayOrder = null;
      let paymentMode = "COD";

      try {
        // Initialize Razorpay
        const razorpay = await initializeRazorpay();

        if (razorpay) {
          // Proceed with Razorpay order creation for online payment
          const options = {
            amount: Math.round(totalAmount * 100), // amount in the smallest currency unit
            currency: "INR",
            receipt: "ORD-" + Date.now(),
          };
          razorpayOrder = await razorpay.orders.create(options);
          paymentMode = "UPI";
        } else {
          paymentMode = "COD";
        }
      } catch (error) {
        // If Razorpay initialization fails, switch to COD
        paymentMode = "COD";
        console.log(
          "Error initializing Razorpay. Switching to COD:",
          error.message
        );
      }

      const order = await Order.create({
        user_id: req.login_web_user ? req.login_web_user._id : "",
        order_total_amount: totalAmount,
        order_subtotal_amount: subTotal,
        status: "pending",
        payment_mode: paymentMode,
        payment_status: "unpaid",
      });

      // 📦 Create Order History Items (after paymentMode finalized)
      await Promise.all(
        rawOrderItems.map(async ({ product, item, amount }) => {
          if (item.size) {
            console.log("item.size", item.size);
            
          } else{
            console.log("item.size is not found");
            
          }
          // Extract size information - handle both array and string formats
          let sizeValue = null;
          if (item.size) {
            if (Array.isArray(item.size)) {
              sizeValue = item.size.join(", ");
            } else if (typeof item.size === 'string') {
              sizeValue = item.size;
            }
          }
          
          await OrderHistory.create({
            user_id: req.login_web_user._id,
            order_id: order._id,
            product_id: item.product_id,
            product_name: product.door_name,
            size: sizeValue,
            mrp: item.mrp,
            quantity: item.quantity,
            sub_total: amount,
            status: "pending",
            payment_mode: paymentMode,
            payment_status: "unpaid",
          });
        })
      );

      // Check if _id exists in billingAddress and delete it
      const userBillingAddress = new UserBillingAddress({
        ...billing_address,
        user_id: req.login_web_user._id,
        order_id: order._id,
      });
      await userBillingAddress.save();

      return res.send({
        order_id: order._id || null,
        orderId: razorpayOrder?.id || null,
        amount: totalAmount,
        currency: "INR",
        payment_mode: paymentMode,
      });
    } catch (error) {
      console.error("Error in order", error);
      return res.status(500).send({
        message: "Something went wrong, please try again later",
        error: error.message,
      });
    }
  };

  static checkout = async (req, res) => {
    try {
      const {
        orderId,
        order_id, // For COD payments, this may be undefined or null
      } = req.body;

      // Fetch order details to get payment_mode from Order table
      const order = await Order.findById(order_id);
      if (!order) {
        return res.status(400).send({
          message: "Order not found",
        });
      }

      // create Transaction
      await Transaction.create({
        order_id: order_id,
        user_id: order.user_id,
        orderId: orderId,
        amount: order.order_total_amount,
        currency: "INR",
        status: "success",
      });

      await Order.updateOne(
        { _id: order_id },
        {
          $set: {
            payment_status: "paid",
          },
        }
      );

      await OrderHistory.updateOne(
        { order_id: order_id },
        {
          $set: {
            orderId: orderId,
            payment_status: "paid",
          },
        }
      );
      res.send({
        status: 200,
        message: "Payment verified successfully",
      });
    } catch (error) {
      console.log("Error in checkout", error);
      return res.status(500).send({
        message: "Something went wrong, please try again later",
        error: error.message,
      });
    }
  };
}

module.exports = PaymentController;
const formatDate = (date) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};
