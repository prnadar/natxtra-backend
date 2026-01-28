const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const DistributorController = require("../../controllers/admin/distributorController");
const checkPermission = require("../../middlewares/permissions");

router.get("/distributor", NotLoggedIn, DistributorController.distributors);
router.get(
  "/distributor-management",
  NotLoggedIn,
  DistributorController.manageDistributors
);
router.post(
  "/create-distributor",
  NotLoggedIn,
  checkPermission("Distributor", "create"),
  DistributorController.createDistributor
);
router.post(
  "/update-distributor",
  NotLoggedIn,
  checkPermission("Distributor", "edit"),
  DistributorController.updateDistributor
);
router.post(
  "/delete-distributor",
  NotLoggedIn,
  checkPermission("Distributor", "delete"),
  DistributorController.deleteDistributor
);
router.post(
  "/delete-distributors",
  NotLoggedIn,
  checkPermission("Distributor", "delete"),
  DistributorController.deleteDistributors
);

module.exports = router;
