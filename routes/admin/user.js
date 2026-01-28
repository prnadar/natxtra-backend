const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const UserController = require("../../controllers/admin/userController");
const checkPermission = require("../../middlewares/permissions");

router.get("/user-management", NotLoggedIn, UserController.userManagement);
router.post(
  "/create-user",
  NotLoggedIn,
  checkPermission("User", "create"),
  UserController.createUser
);
router.post(
  "/update-user",
  NotLoggedIn,
  checkPermission("User", "edit"),
  UserController.updateUser
);
router.post(
  "/delete-user",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteUser
);
router.post(
  "/delete-users",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteUsers
);

router.get(
  "/create-new-role",
  NotLoggedIn,
  checkPermission("User", "create"),
  UserController.createRole
);
router.post(
  "/create-new-role",
  NotLoggedIn,
  checkPermission("User", "create"),
  UserController.createNewRole
);
router.post(
  "/update-role",
  NotLoggedIn,
  checkPermission("User", "edit"),
  UserController.updateRole
);
router.post(
  "/delete-role",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteRole
);
router.post(
  "/delete-roles",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteRoles
);

router.get(
  "/create-new-designation",
  NotLoggedIn,
  checkPermission("User", "view"),
  UserController.createDesignation
);

router.post(
  "/create-new-designation",
  NotLoggedIn,
  checkPermission("User", "create"),
  UserController.createNewDesignation
);
router.post(
  "/update-designation",
  NotLoggedIn,
  checkPermission("User", "edit"),
  UserController.updateDesignation
);
router.post(
  "/delete-designation",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteDesignation
);
router.post(
  "/delete-designations",
  NotLoggedIn,
  checkPermission("User", "delete"),
  UserController.deleteDesignations
);

module.exports = router;
