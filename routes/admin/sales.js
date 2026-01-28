const router = require("express").Router();
const { NotLoggedIn, LoggedIn } = require("../../middlewares/Adminauth");
const SalesController = require("../../controllers/admin/salesController");
const checkPermission = require("../../middlewares/permissions");

router.get("/sales-dash", NotLoggedIn, SalesController.dashboard);
router.get("/lead-listing", NotLoggedIn, SalesController.leadListing);
router.get(
  "/allocate-lead-listing",
  NotLoggedIn,
  SalesController.allocateLeadListing
);
router.post("/assign-leads", NotLoggedIn, SalesController.assignLead);
router.post(
  "/add-lead",
  NotLoggedIn,
  checkPermission("Sales", "create"),
  SalesController.addLead
);
router.post(
  "/edit-lead",
  NotLoggedIn,
  checkPermission("Sales", "edit"),
  SalesController.editLead
);
router.post(
  "/delete-lead",
  NotLoggedIn,
  checkPermission("Sales", "delete"),
  SalesController.deleteLead
);
router.post(
  "/delete-leads",
  NotLoggedIn,
  checkPermission("Sales", "delete"),
  SalesController.deleteLeads
);
router.post(
  "/add-xlsx-leads",
  NotLoggedIn,
  checkPermission("Sales", "create"),
  SalesController.addXlsxLeads
);
// Add these routes to your sales routes file
router.post(
  "/add-product",
  NotLoggedIn,
  checkPermission("Sales", "edit"),
  SalesController.addProduct
);

router.get("/products/:id", NotLoggedIn, SalesController.getProducts);

router.post(
  "/delete-product",
  NotLoggedIn,
  checkPermission("Sales", "edit"),
  SalesController.deleteProduct
);
router.post(
  "/upload-profile-image",
  NotLoggedIn,
  checkPermission("Sales", "edit"),
  SalesController.uploadProfileImage
);
router.get("/lead-details/:id", NotLoggedIn, SalesController.getLeadDetails);

router.post(
  "/update-remarks",
  NotLoggedIn,
  checkPermission("Sales", "edit"),
  SalesController.updateRemarks
);
module.exports = router;
