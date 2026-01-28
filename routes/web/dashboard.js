const router = require("express").Router();
// const { NotLoggedIn } = require("../../middlewares/Adminauth");
const DashboardController = require("../../controllers/web/dashboardController");

router.get("/index", DashboardController.dashboard);

module.exports = router;
