const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/WebAuth");
const WebsiteController = require("../../controllers/web/apiController");

router.get("/get_categories", WebsiteController.category);
router.get("/get_sliders", WebsiteController.get_slider);
router.get("/get_banners", WebsiteController.get_banners);
router.get("/get_all_faqs", WebsiteController.get_all_faqs);
router.get("/get_webSettings_data", WebsiteController.get_webSettings_data);

router.post("/contactus", WebsiteController.contactus);
router.get("/get_contactus_info", WebsiteController.get_contactus);
router.get("/get_all_stores", WebsiteController.get_all_stores);

router.get("/get_all_products", WebsiteController.get_all_products);
router.get("/products_by_category", WebsiteController.products_by_category);

router.get("/get_gallery_categories", WebsiteController.get_gallery_categories);
router.get("/get_gallery", WebsiteController.get_gallery);
router.get(
  "/get_gallery_by_category",
  WebsiteController.get_gallery_by_category
);

router.get(
  "/get_userBillingAddress",
  NotLoggedIn,
  WebsiteController.get_userBillingAddress
);
router.post(
  "/add-userBillingAddress",
  NotLoggedIn,
  WebsiteController.add_userBillingAddress
);
router.post(
  "/update-userBillingAddress",
  NotLoggedIn,
  WebsiteController.update_userBillingAddress
);
router.post(
  "/delete-userBillingAddress",
  NotLoggedIn,
  WebsiteController.delete_userBillingAddress
);
router.post(
  "/make_default-userBillingAddress",
  NotLoggedIn,
  WebsiteController.makeDefault_userBillingAddress
);
router.get(
  "/get_default-userBillingAddress",
  NotLoggedIn,
  WebsiteController.getDefault_userBillingAddress
);

router.get("/get_orders", NotLoggedIn, WebsiteController.getOrders);
router.get("/get_orderItems", NotLoggedIn, WebsiteController.orderItems);
router.get(
  "/get_transactions",
  NotLoggedIn,
  WebsiteController.get_transactions
);
module.exports = router;
