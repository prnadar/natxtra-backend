const Adminauth = require("../../models/Adminauth");
const Slider = require("../../models/Slider");
const Banner = require("../../models/Banner");
const Aboutus = require("../../models/Aboutus");
const TermsCondition = require("../../models/TermsCondition");
const PrivacyPolicy = require("../../models/PrivacyPolicy");
const Faq = require("../../models/Faq");
const RefundPolicy = require("../../models/RefundPolicy");
const ShippingPolicy = require("../../models/ShippingPolicy");
const Contactus = require("../../models/Contactus");
const Product = require("../../models/Product");
const Store = require("../../models/Store");
const GalleryCategory = require("../../models/GalleryCategory");
const Gallery = require("../../models/Gallery");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");

class WebManagementController {
  static webReview = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      return res.render("admin/web-review", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  // #region Products
  static productsList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Product.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let products = await Product.find({})
        .populate("unit_id")
        .populate("category_id")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/products-list", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        products,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static updateProductStatus = async (req, res) => {
    try {
      const { productId, visibility_status } = req.body;

      await Product.findByIdAndUpdate(productId, {
        visibility_status: visibility_status,
        updated_at: new Date(),
      });

      // Send a success response
      res.status(200).send({
        status: 200,
        message: "Status Update Successfully!",
      });
    } catch (error) {
      console.error("Error Status Update:", error);
      return res.status(500).send({
        status: 500,
        message: "Error Status Change",
        error: error.message,
      });
    }
  };

  // #region Slider
  static slidersList = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Slider.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let sliders = await Slider.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/sliders", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        sliders,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static addSlider = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (!req.file) {
          return res.send({
            status: 400,
            message: "Please upload an image",
          });
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const insertRecord = Slider({
          image: req.file.filename,
          title: req.body.title,
          url: req.body.url,
          description: req.body.description,
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Slider added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error creating slider: " + error.message });
    }
  };

  static editSlider = async (req, res) => {
    try {
      editupload(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const slider = await Slider.findOne({
          _id: req.body.editid,
        });
        if (!slider) {
          return res.status(404).send({ message: "editid not found" });
        }

        const updatedData = {
          title: req.body.edit_title,
          url: req.body.edit_url,
          description: req.body.edit_description,
          updated_at: new Date(),
        };

        if (req.file) {
          updatedData.image = req.file ? req.file.filename : null;
        }
        await Slider.findOneAndUpdate({ _id: req.body.editid }, updatedData, {
          new: true,
        });

        if (req.file && slider.image) {
          fs.unlink(
            path.join(root, "/public/uploads/slider/" + slider.image),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        return res.send({
          status: 200,
          message: "Slider updated successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error updating slider: " + error.message });
    }
  };

  static deleteSlider = async (req, res) => {
    try {
      await Slider.findByIdAndDelete(req.body.id);
      return res.send({
        status: 200,
        message: "Slider deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error deleting slider: " + error.message });
    }
  };
  // #endregion Slider

  // #region Banner
  static bannerList = async (req, res) => {
    try {
      const banners = await Banner.findOne();

      return res.render("admin/banner", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter

        home_banner_1_image: banners ? banners.home_banner_1.image : "",
        home_banner_2_image: banners ? banners.home_banner_2.image : "",

        home_banner_1_title: banners ? banners.home_banner_1.title : "",
        home_banner_2_title: banners ? banners.home_banner_2.title : "",

        home_banner_1_description: banners
          ? banners.home_banner_1.description
          : "",
        home_banner_2_description: banners
          ? banners.home_banner_2.description
          : "",
        banners,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error listing banner: " + error.message);
    }
  };

  static addBanner = async (req, res) => {
    try {
      uploadBanner(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const data = req.body;
        const files = req.files || {};

        let exist = await Banner.findOne();

        const bannerData = {
          home_banner_1: {
            image: files.home_banner_1_image
              ? files.home_banner_1_image[0].filename
              : exist
              ? exist.home_banner_1.image
              : "", // Retain existing image if not replaced
            title: data.home_banner_1_title,
            description: data.home_banner_1_description.trim(),
          },
          home_banner_2: {
            image: files.home_banner_2_image
              ? files.home_banner_2_image[0].filename
              : exist
              ? exist.home_banner_2.image
              : "", // Retain existing image if not replaced
            title: data.home_banner_2_title,
            description: data.home_banner_2_description.trim(),
          },
        };

        if (exist) {
          // Delete old images only if new images are uploaded
          if (files.home_banner_1_image && exist.home_banner_1.image) {
            fs.unlink(
              path.join(
                root,
                "/public/uploads/banner/",
                exist.home_banner_1.image
              ),
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          }

          if (files.home_banner_2_image && exist.home_banner_2.image) {
            fs.unlink(
              path.join(
                root,
                "/public/uploads/banner/",
                exist.home_banner_2.image
              ),
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          }

          bannerData.updated_at = new Date();
          await Banner.updateOne({}, bannerData);
        } else {
          const newBanner = new Banner(bannerData);
          await newBanner.save();
        }

        return res.send({
          status: 200,
          message: "Banner added successfully",
        });
      });
    } catch (error) {
      console.error(error);
      return res.send({
        status: 500,
        message: "Failed to add banner: " + error.message,
      });
    }
  };
  // #endregion Banner

  // #region About Us
  static aboutusGET = async (req, res) => {
    try {
      const data = await Aboutus.findOne({});
      return res.render("admin/aboutus", {
        content: data ? data.content : "",
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static aboutusPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await Aboutus.findOne();
      if (exist) {
        const data = req.body;
        await Aboutus.findOneAndUpdate(
          {},
          {
            content: data.content.trim(),
            updated_at: Date.now(),
          }
        );
      } else {
        const data = req.body;
        const aboutus = await Aboutus({
          content: data.content.trim(),
        });

        await aboutus.save();
      }
      return res.send({
        error: false,
        message: "Aboutus updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion About Us

  // #region Terms and Conditions
  static termsconditionGET = async (req, res) => {
    try {
      const data = await TermsCondition.findOne({});
      return res.render("admin/termscondition", {
        content: data ? data.content : "",
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static termsconditionPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await TermsCondition.findOne();
      if (exist) {
        data.updated_at = Date.now();
        await TermsCondition.updateOne({}, data);
      } else {
        const data = req.body;
        // console.log(data);
        const termscondition = await TermsCondition({
          content: data.content.trim(),
        });

        await termscondition.save();
      }

      return res.send({
        error: false,
        message: "Terms & Condition added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion Terms and Conditions

  // #region Privacy Policy
  static privacypolicyGET = async (req, res) => {
    try {
      const data = await PrivacyPolicy.findOne({});
      return res.render("admin/privacypolicy", {
        content: data ? data.content : "",
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static privacypolicyPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await PrivacyPolicy.findOne();
      if (exist) {
        data.updated_at = Date.now();
        await PrivacyPolicy.updateOne({}, data);
      } else {
        const data = req.body;
        // console.log(data);
        const privacypolicy = await PrivacyPolicy({
          content: data.content.trim(),
        });

        await privacypolicy.save();
      }
      return res.send({
        error: false,
        message: "Privacy Policy added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion Privacy Policy

  // #region Faq
  static faqGET = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Faq.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let faq = await Faq.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/faqs", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        faq,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static faqPOST = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.title = data.title;
      data.description = data.description;

      const faq = Faq(data);

      //save data
      await faq.save();
      return res.send({
        error: false,
        message: "Faq added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static faqDelete = async (req, res) => {
    try {
      const faq = await Faq.findById(req.params.id);
      if (!faq) {
        return res.status(404).send({ error: true, message: "Faq not found" });
      }

      await Faq.deleteOne({ _id: faq._id });

      return res.send({
        error: false,
        message: "Faq deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion Faq

  //#region Refund Policy
  static refundPolicyGET = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await RefundPolicy.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let refundPolicy = await RefundPolicy.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/refundPolicy", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        refundPolicy,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static refundPolicyPOST = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.title = data.title;
      data.description = data.description;

      const refundPolicy = RefundPolicy(data);
      //save data
      await refundPolicy.save();
      return res.send({
        error: false,
        message: "Refund Policy added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static refundPolicyDelete = async (req, res) => {
    try {
      const refundPolicy = await RefundPolicy.findById(req.params.id);
      if (!refundPolicy) {
        return res
          .status(404)
          .send({ error: true, message: "Refund Policy not found" });
      }

      await RefundPolicy.deleteOne({ _id: refundPolicy._id });

      return res.send({
        error: false,
        message: "Refund Policy deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  //#endregion Refund Policy

  //#region Shipping Policy
  static shippingPolicyGET = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await ShippingPolicy.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let shippingpolicy = await ShippingPolicy.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/shippingPolicy", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        shippingpolicy,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static shippingPolicyPOST = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.title = data.title;
      data.description = data.description;

      const shippingPolicy = ShippingPolicy(data);
      //save data
      await shippingPolicy.save();
      return res.send({
        error: false,
        message: "Shipping Policy added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static shippingPolicyDelete = async (req, res) => {
    try {
      const shippingPolicy = await ShippingPolicy.findById(req.params.id);
      if (!shippingPolicy) {
        return res
          .status(404)
          .send({ error: true, message: "Shipping Policy not found" });
      }

      await ShippingPolicy.deleteOne({ _id: shippingPolicy._id });

      return res.send({
        error: false,
        message: "Shipping Policy deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  //#endregion Shipping Policy

  // #region Contact Us
  static contactusList = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Contactus.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let contactus = await Contactus.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();

      return res.render("admin/contactus", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        contactus,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  // #endregion Contact Us

  // #region Stores
  static storesList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Faq.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let store = await Store.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/stores", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        store,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static addStore = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.name = data.name;
      data.phone = data.phone;
      data.address = data.address;
      data.state = data.state;
      data.city = data.city;
      data.pincode = data.pincode;
      data.url = data.url;

      const store = Store(data);

      //save data
      await store.save();
      return res.send({
        error: false,
        message: "Store added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static deleteStore = async (req, res) => {
    try {
      const store = await Store.findByIdAndDelete(req.body.id);
      if (!store) {
        return res
          .status(404)
          .send({ error: true, message: "Store not found" });
      }

      return res.send({
        error: false,
        message: "Store deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion Stores

  // #region Gallery Category
  static galleryCategoryList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await GalleryCategory.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let galleryCategory = await GalleryCategory.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/gallery-category", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        galleryCategory,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static addGalleryCategory = async (req, res) => {
    try {
      uploadCategory(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const insertRecord = GalleryCategory({
          icon: req.file ? req.file.filename : null,
          name: req.body.name,
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Gallery Category added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static deleteGalleryCategory = async (req, res) => {
    try {
      const categoryId = req.body.id;

      // Check if any galleries exist in this category
      const galleryCount = await Gallery.countDocuments({
        gallery_category_id: categoryId,
      });

      if (galleryCount > 0) {
        return res.status(400).send({
          message: "Cannot delete category. Galleries exist in this category.",
          error: true,
        });
      }

      // Safe to delete
      await GalleryCategory.findByIdAndDelete(categoryId);

      res.status(200).send({
        message: "Gallery Category deleted successfully.",
        error: false,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Gallery Category deletion failed.",
        error: true,
      });
    }
  };

  // #endregion Gallery Category

  // #region Gallery
  static galleryList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await Gallery.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const categories = await GalleryCategory.find({}).lean();
      let gallery = await Gallery.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
      return res.render("admin/gallery-list", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "web", // Added pageId parameter
        categories,
        gallery,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static addGallery = async (req, res) => {
    try {
      uploadGallery(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (!req.file) {
          return res.send({
            status: 400,
            message: "Please upload an image",
          });
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const insertRecord = Gallery({
          image: req.file.filename,
          gallery_category_id: req.body.gallery_category_id,
          title: req.body.title,
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Gallery added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static deleteGallery = async (req, res) => {
    try {
      await Gallery.findByIdAndDelete(req.body.id);
      res.status(200).send({
        message: "Gallery Deleted Successfully.",
        error: false,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  // #endregion Gallery
}

// #region Set The Storage Engine for Slider
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/slider"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("image");

const editupload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("editimage");
// #endregion Set The Storage Engine for Slider

// #region Set The Storage Engine for Banner
const storage1 = multer.diskStorage({
  destination: path.join(root, "/public/uploads/banner"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const uploadBanner = multer({
  storage: storage1,
  fileFilter: imageFilter,
}).fields([
  { name: "home_banner_1_image", maxCount: 1 },
  { name: "home_banner_2_image", maxCount: 1 },
]);
// #endregion Set The Storage Engine for Banner

// #region Set The Storage Engine for Gallery Category
const storage2 = multer.diskStorage({
  destination: path.join(root, "/public/uploads/galleryCategory"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const uploadCategory = multer({
  storage: storage2,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("icon");
// #endregion Set The Storage Engine for Gallery Category

// #region Set The Storage Engine for Gallery
const storage3 = multer.diskStorage({
  destination: path.join(root, "/public/uploads/gallery"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const uploadGallery = multer({
  storage: storage3,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("image");
// #endregion Set The Storage Engine for Gallery

module.exports = WebManagementController;
