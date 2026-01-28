const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const ReportController = require("../../controllers/admin/reportController");

router.get("/report-dash", NotLoggedIn, ReportController.dashboard);
router.get("/report-sales", NotLoggedIn, ReportController.reportSales);
router.post(
  "/sales-report-generate",
  NotLoggedIn,
  ReportController.generateSalesReport
);
router.get(
  "/download-sales-report/:id",
  NotLoggedIn,
  ReportController.downloadSalesReport
);

router.get(
  "/report-distributor",
  NotLoggedIn,
  ReportController.reportDistributor
);
router.post(
  "/distributor-report-generate",
  NotLoggedIn,
  ReportController.generateDistributorReport
);
router.get(
  "/download-distributor-report/:id",
  NotLoggedIn,
  ReportController.downloadDistributorReport
);

router.get("/report-user", NotLoggedIn, ReportController.reportUser);
router.post(
  "/user-report-generate",
  NotLoggedIn,
  ReportController.generateUserReport
);
router.get(
  "/download-user-report/:id",
  NotLoggedIn,
  ReportController.downloadUserReport
);

router.get("/report-hrms", NotLoggedIn, ReportController.reportHrms);
router.post(
  "/hrms-report-generate",
  NotLoggedIn,
  ReportController.generateHrmsReport
);
router.get(
  "/download-hrms-report/:id",
  NotLoggedIn,
  ReportController.downloadHrmsReport
);

router.get("/report-inventory", NotLoggedIn, ReportController.reportInventory);
router.post(
  "/inventory-report-generate",
  NotLoggedIn,
  ReportController.generateInventoryReport
);
router.get(
  "/download-inventory-report/:id",
  NotLoggedIn,
  ReportController.downloadInventoryReport
);

router.get("/report-accounts", NotLoggedIn, ReportController.reportAccounts);
router.post(
  "/accounts-report-generate",
  NotLoggedIn,
  ReportController.generateAccountsReport
);
router.get(
  "/download-accounts-report/:id",
  NotLoggedIn,
  ReportController.downloadAccountsReport
);
router.get("/view-user-report/:id", ReportController.viewUserReport);

module.exports = router;
