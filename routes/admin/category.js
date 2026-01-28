const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const CategoryController = require("../../controllers/admin/categoryController");

router.get("/category-list", NotLoggedIn, CategoryController.list);
router.post("/category-add", NotLoggedIn, CategoryController.add);
router.post("/category-edit", NotLoggedIn, CategoryController.edit);
router.post("/category-delete", NotLoggedIn, CategoryController.deleteCategory);

module.exports = router;
