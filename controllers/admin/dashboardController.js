const Order = require("../../models/Order");
const OrderHistory = require("../../models/OrderHistory");
const User = require("../../models/User");
const Leads = require("../../models/Leads");
const WebUser = require("../../models/WebUser");
const SalesInvoice = require("../../models/SalesInvoice");
const Transaction = require("../../models/Transaction");
const SupportTicket = require("../../models/SupportTicket");

class DashboardController {
  static dashboard = async (req, res) => {
    try {
      // pending, shifted, process orders count
      const pendingOrdersCount = await Order.countDocuments({
        status: "pending",
      });
      const shiftedOrdersCount = await Order.countDocuments({
        status: "shifted",
      });
      const processOrdersCount = await Order.countDocuments({
        status: "process",
      });

      // Total users count
      const totalUsersCount = await User.countDocuments();

      // Total leads count
      const totalLeadsCount = await Leads.countDocuments();

      // Total web users count
      const totalWebUsersCount = await WebUser.countDocuments();

      // Total payment received
      const paymentReceivedData = await Order.aggregate([
        { $match: { payment_status: "paid" } },
        { $group: { _id: null, total: { $sum: "$order_subtotal_amount" } } },
      ]);

      const totalPaymentReceived = paymentReceivedData[0]?.total || 0;

      // 🧾 Total payment overdue (from SalesInvoice)
      const today = new Date();
      const overdueInvoices = await SalesInvoice.aggregate([
        {
          $match: {
            status: "due",
            due_date: { $lt: today },
          },
        },
        {
          $group: {
            _id: null,
            totalOverdue: { $sum: "$subtotal" },
          },
        },
      ]);

      const totalPaymentOverdue = overdueInvoices[0]?.totalOverdue || 0;

      // Total Oders count
      const totalOrdersCount = await Order.countDocuments();

      // Total Deliverd Orders count in transaction success status
      const totalDeliverdOrdersCount = await Transaction.countDocuments({
        status: "success",
      });

      // Orders listing only 10 latest orders
      const orders = await OrderHistory.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user_id product_id");

      // Support tickets listing only 5 latest tickets
      const supportTickets = await SupportTicket.find({})
        .populate("user_id")
        .sort({ created_at: -1 })
        .limit(5)
        .lean();

      return res.render("admin/dashboard", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user, // Consistent naming
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "dashboard", // Added pageId parameter to identify current page
        pendingOrdersCount,
        shiftedOrdersCount,
        processOrdersCount,
        totalUsersCount,
        totalLeadsCount,
        totalWebUsersCount,
        totalPaymentReceived,
        totalPaymentOverdue,
        totalOrdersCount,
        totalDeliverdOrdersCount,
        orders,
        supportTickets,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      console.error("Error Stack:", error.stack);
      return res.status(500).send(`Error: ${error.message}`);
    }
  };
}

module.exports = DashboardController;
