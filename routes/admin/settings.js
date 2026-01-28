const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SettingController = require("../../controllers/admin/settingController");
const checkPermission = require("../../middlewares/permissions");

router.get("/general-settings", NotLoggedIn, SettingController.generalSettings);
router.post(
  "/general-settings",
  NotLoggedIn,
  checkPermission("Setting", "edit"),
  SettingController.generalSettingsAdd
);
router.get("/setting-email", NotLoggedIn, SettingController.settingEmail);
router.post(
  "/smtp_config_add",
  NotLoggedIn,
  checkPermission("Setting", "create"),
  SettingController.smtp_config_add
);

router.get("/razorpay_config", NotLoggedIn, SettingController.razorpay_config);
router.post(
  "/razorpay_config_add",
  NotLoggedIn,
  SettingController.razorpay_config_add
);

module.exports = router;
