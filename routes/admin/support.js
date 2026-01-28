const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SupportController = require("../../controllers/admin/supportController");

router.get("/support-ticket-list", NotLoggedIn, SupportController.dashboard);
router.get(
  "/support-ticket-reply/:id",
  NotLoggedIn,
  SupportController.getReplyTicket
);
router.post(
  "/support-ticket-reply/:id",
  NotLoggedIn,
  SupportController.postReplyTicket
);
router.post(
  "/create-support-ticket",
  NotLoggedIn,
  SupportController.createSupportTicket
);
router.post("/assign-support-ticket", NotLoggedIn, SupportController.assignSupportTicket);

module.exports = router;
