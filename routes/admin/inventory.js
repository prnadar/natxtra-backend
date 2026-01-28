const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const InventoryController = require("../../controllers/admin/inventoryController");

router.get("/inventory-Dash", NotLoggedIn, InventoryController.dashboard);
router.get("/products-manage", NotLoggedIn, InventoryController.productManage);
// router.get("/added_new_product", NotLoggedIn, InventoryController.addProduct);
router.post("/create-product", NotLoggedIn, InventoryController.addProduct);
router.post("/update-product", NotLoggedIn, InventoryController.editProduct);
router.post("/delete_product", NotLoggedIn, InventoryController.deleteProduct);
router.post(
  "/delete_products",
  NotLoggedIn,
  InventoryController.deleteProducts
);
router.get(
  "/products-stock-list",
  NotLoggedIn,
  InventoryController.productStockList
);
router.post(
  "/update-quantity",
  NotLoggedIn,
  InventoryController.updateQuantity
);

module.exports = router;
