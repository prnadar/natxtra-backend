const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const WebManagementController = require("../../controllers/admin/webManagementController");
const checkPermission = require("../../middlewares/permissions");

router.get("/web-review", NotLoggedIn, WebManagementController.webReview);

router.get("/products-list", NotLoggedIn, WebManagementController.productsList);
router.post(
  "/product-status-update",
  NotLoggedIn,
  WebManagementController.updateProductStatus
);

//#region Slider
router.get("/sliders-list", NotLoggedIn, WebManagementController.slidersList);
router.post(
  "/add-slider",
  NotLoggedIn,
  checkPermission("Web Management", "create"),
  WebManagementController.addSlider
);
router.post(
  "/edit-slider",
  NotLoggedIn,
  checkPermission("Web Management", "edit"),
  WebManagementController.editSlider
);
router.post(
  "/delete-slider",
  NotLoggedIn,
  checkPermission("Web Management", "delete"),
  WebManagementController.deleteSlider
);
// #endregion slider

//#region Banner
router.get("/banners-list", NotLoggedIn, WebManagementController.bannerList);
router.post(
  "/add-banner",
  NotLoggedIn,
  checkPermission("Web Management", "edit"),
  WebManagementController.addBanner
);
// #endregion Banner

//#region About Us
router.get("/aboutus", NotLoggedIn, WebManagementController.aboutusGET);
router.post("/aboutus", NotLoggedIn, WebManagementController.aboutusPOST);
// #endregion About Us

//#region Terms and Conditions
router.get(
  "/termscondition",
  NotLoggedIn,
  WebManagementController.termsconditionGET
);
router.post(
  "/termscondition",
  NotLoggedIn,
  WebManagementController.termsconditionPOST
);
//#endregion Terms and Conditions

//#region Privacy Policy
router.get(
  "/privacypolicy",
  NotLoggedIn,
  WebManagementController.privacypolicyGET
);
router.post(
  "/privacypolicy",
  NotLoggedIn,
  WebManagementController.privacypolicyPOST
);
//#endregion Privacy Policy

//#region Refund Policy
router.get(
  "/refundpolicy",
  NotLoggedIn,
  WebManagementController.refundPolicyGET
);
router.post(
  "/refundpolicy",
  NotLoggedIn,
  WebManagementController.refundPolicyPOST
);
router.post(
  "/refundpolicy-delete/:id",
  NotLoggedIn,
  WebManagementController.refundPolicyDelete
);
// #endregion Refund Policy

// #region Shipping Policy
router.get(
  "/shippingpolicy",
  NotLoggedIn,
  WebManagementController.shippingPolicyGET
);
router.post(
  "/shippingpolicy",
  NotLoggedIn,
  WebManagementController.shippingPolicyPOST
);
router.post(
  "/shippingpolicy-delete/:id",
  NotLoggedIn,
  WebManagementController.shippingPolicyDelete
);
//#endregion Shipping Policy

//#region FAQ
router.get("/faq", NotLoggedIn, WebManagementController.faqGET);
router.post("/faq-add", NotLoggedIn, WebManagementController.faqPOST);
router.post("/faq-delete/:id", NotLoggedIn, WebManagementController.faqDelete);
// #endregion FAQ

//#region Contact Us
router.get("/contactus", NotLoggedIn, WebManagementController.contactusList);
// #endregion Contact Us

//#region Store
router.get("/stores-list", NotLoggedIn, WebManagementController.storesList);
router.post(
  "/add-store",
  NotLoggedIn,
  checkPermission("Web Management", "edit"),
  WebManagementController.addStore
);
router.post(
  "/delete-store",
  NotLoggedIn,
  checkPermission("Web Management", "delete"),
  WebManagementController.deleteStore
);
//#endregion Store

//#region Gallery Category
router.get(
  "/gallery-category-list",
  NotLoggedIn,
  WebManagementController.galleryCategoryList
);
router.post(
  "/add-gallery-category",
  NotLoggedIn,
  checkPermission("Web Management", "create"),
  WebManagementController.addGalleryCategory
);
router.post(
  "/delete-gallery-category",
  NotLoggedIn,
  checkPermission("Web Management", "delete"),
  WebManagementController.deleteGalleryCategory
);
// #endregion Gallery Category

//#region Gallery
router.get("/gallery-list", NotLoggedIn, WebManagementController.galleryList);
router.post(
  "/add-gallery",
  NotLoggedIn,
  checkPermission("Web Management", "create"),
  WebManagementController.addGallery
);
router.post(
  "/delete-gallery",
  NotLoggedIn,
  checkPermission("Web Management", "delete"),
  WebManagementController.deleteGallery
);
//#endregion Gallery

module.exports = router;
