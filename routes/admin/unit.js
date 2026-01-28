const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const UnitController = require("../../controllers/admin/unitController");

router.get("/unit-list", NotLoggedIn, UnitController.list);
router.post("/unit-add", NotLoggedIn, UnitController.add);
router.post("/unit-edit", NotLoggedIn, UnitController.edit);
router.post("/unit-delete", NotLoggedIn, UnitController.deleteUnit);
router.post("/units-delete", NotLoggedIn, UnitController.deleteUnits);

module.exports = router;
