const router = require("express").Router();
const webauthController = require("../../controllers/web/webauthController");

const { NotLoggedIn } = require("../../middlewares/WebAuth");

router.post("/register", webauthController.register);
router.post("/login", webauthController.loginPOST);
router.post("/profile", NotLoggedIn, webauthController.user_profile);
router.post("/update-profile", NotLoggedIn, webauthController.update_profile);
router.post("/change-password", NotLoggedIn, webauthController.change_password);
router.post("/forgot-password", webauthController.forgot_password);
router.post("/logout", webauthController.logout);

module.exports = router;
