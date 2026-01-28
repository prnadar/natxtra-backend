const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const AccountController = require("../../controllers/admin/accountController");

router.get("/accounts-dash-new", NotLoggedIn, AccountController.dashboard);
router.get("/user-address", AccountController.getUserAddress);

//#region Purchase Invoice Routes
router.get(
  "/accounts-purchase-invoice",
  NotLoggedIn,
  AccountController.purchaseInvoice
);
router.get(
  "/create-purchase-invoice",
  NotLoggedIn,
  AccountController.createPurchaseInvoice
);
router.post(
  "/create-purchase-invoice",
  NotLoggedIn,
  AccountController.create_purchaseInvoice
);
//#endregion

//#region Sales Invoice Routes
router.get(
  "/accounts-sales-invoice",
  NotLoggedIn,
  AccountController.salesInvoice
);
router.get(
  "/create-sales-invoice",
  NotLoggedIn,
  AccountController.createSalesInvoice
);
router.post(
  "/create-sales-invoice",
  NotLoggedIn,
  AccountController.create_salesInvoice
);
//#endregion

//#region Estimation Invoice Routes
router.get(
  "/accounts-estimation-invoice",
  NotLoggedIn,
  AccountController.estimationInvoice
);
router.get(
  "/create-estimation-invoice",
  NotLoggedIn,
  AccountController.createEstimationInvoice
);
router.post(
  "/create-estimation-invoice",
  NotLoggedIn,
  AccountController.create_estimationInvoice
);
//#endregion

module.exports = router;
