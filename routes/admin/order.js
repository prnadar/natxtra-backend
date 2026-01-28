const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const OrderController = require("../../controllers/admin/orderController");

router.get("/oerder-all", NotLoggedIn, OrderController.ordersAll);
router.get("/oerder-pending", NotLoggedIn, OrderController.orderPending);
router.get("/oerder-process", NotLoggedIn, OrderController.orderProcess);
router.get("/oerder-shifted", NotLoggedIn, OrderController.orderShifted);

router.post(
  "/update_order_status",
  NotLoggedIn,
  OrderController.updateOrderStatus
);

module.exports = router;
