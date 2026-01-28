const Adminauth = require("../../models/Adminauth");
const OrderHistory = require("../../models/OrderHistory");
const Order = require("../../models/Order");

class OrderController {
  static ordersAll = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const orders = await OrderHistory.find({})
        .sort({ createdAt: -1 })
        .populate("user_id product_id");
      return res.render("admin/oerder-all", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "order",
        orders,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static orderPending = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      const orders = await OrderHistory.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .populate("user_id product_id");
      return res.render("admin/oerder-pending", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "order",
        orders,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static orderProcess = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      const orders = await OrderHistory.find({ status: "process" })
        .sort({ createdAt: -1 })
        .populate("user_id product_id");
      return res.render("admin/oerder-process", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "order",
        orders,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static orderShifted = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      const orders = await OrderHistory.find({ status: "shifted" })
        .sort({ createdAt: -1 })
        .populate("user_id product_id");

      return res.render("admin/oerder-shifted", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "order",
        orders,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static updateOrderStatus = async (req, res) => {
    try {
      const { status, order_id } = req.body;

      if (!order_id || !status) {
        return res
          .status(400)
          .send({ message: "order_id and status are required" });
      }

      // Update Order
      const orderUpdateResult = await Order.updateOne(
        { _id: order_id },
        { status }
      );

      // Update all OrderHistory records with this order_id
      const historyUpdateResult = await OrderHistory.updateMany(
        { order_id: order_id },
        { status }
      );

      res.status(200).send({
        message: "Order status updated successfully",
      });
    } catch (error) {
      console.error("Update failed:", error.message);
      res.status(500).send({
        message: "Failed to update order status: " + error.message,
      });
    }
  };
}

module.exports = OrderController;
