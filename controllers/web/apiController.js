const Category = require("../../models/Category");
const Slider = require("../../models/Slider");
const Banner = require("../../models/Banner");
const Product = require("../../models/Product");
const WebSetting = require("../../models/WebSetting");
const Contactus = require("../../models/Contactus");
const Store = require("../../models/Store");
const Faq = require("../../models/Faq");
const Gallery = require("../../models/Gallery");
const GalleryCategory = require("../../models/GalleryCategory");
const UserBillingAddress = require("../../models/UserBillingAddress");
const Order = require("../../models/Order");
const OrderHistory = require("../../models/OrderHistory");
const Transaction = require("../../models/Transaction");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const baseURL = process.env.BaseURL;

class WebsiteController {
  //#region get_category
  static category = async (req, res) => {
    let mediaUrl = baseURL + "/uploads/category/";
    try {
      const categories = await Category.find().sort({ name: 1 });

      if (!categories || categories.length === 0) {
        return res.send({
          message: "No categories found",
          success: true,
        });
      }
      const responseData = categories.map((category) => {
        return {
          _id: category._id,
          name: category.name,
          icon: category.icon,
        };
      });

      return res.send({
        message: "Success",
        success: true,
        data: responseData,
        mediaUrl,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };
  //#endregion get_category

  //#region get_slider
  static get_slider = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/slider/";
      const sliders = await Slider.find({}).sort({ created_at: -1 });

      return res.send({
        message: "Success",
        success: true,
        data: sliders,
        mediaUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error get all sliders " + error.message,
      });
    }
  };
  //#endregion get_slider

  //#region get_banners
  static get_banners = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/banner/";
      const banners = await Banner.findOne().sort({ created_at: -1 });

      // Set the image URLs for each banner, falling back to the default image if necessary
      const response = {
        home_banner_1: {
          image: banners?.home_banner_1?.image,
          title: banners?.home_banner_1?.title?.trim(),
          description: banners?.home_banner_1?.description?.trim(),
        },
        home_banner_2: {
          image: banners?.home_banner_2?.image,
          title: banners?.home_banner_2?.title?.trim(),
          description: banners?.home_banner_2?.description?.trim(),
        },
        _id: banners?._id,
      };

      return res.send({
        message: "Success",
        success: true,
        data: response,
        mediaUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error getting all banners: " + error.message,
      });
    }
  };
  //#endregion get_banners

  //#region get_all_faqs
  static get_all_faqs = async (req, res) => {
    try {
      const faqs = await Faq.find().sort({ created_at: -1 });
      const cleanedFaqs = faqs.map((faq) => {
        const cleanDescription = faq.description
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/\n/g, " ")
          .replace(/\r/g, "");

        return {
          ...faq.toObject(),
          description: cleanDescription,
        };
      });

      return res.send({
        message: "Success",
        success: true,
        data: cleanedFaqs,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error get all faqs " + error.message,
      });
    }
  };
  //#endregion get_all_faqs

  //#region get web settings data
  static get_webSettings_data = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/websetting/";
      const data = await WebSetting.findOne().sort({ created_at: -1 });

      // Set the image URLs for each banner, falling back to the default image if necessary
      const response = {
        logo: data?.logo ? data?.logo : "",
        company_name: data?.company_name ? data?.company_name : "",
        mobile: data?.mobile ? data?.mobile : "",
        email: data?.email ? data?.email : "",
        address: data?.address ? data?.address : "",
        city: data?.city ? data?.city : "",
        state: data?.state ? data?.state : "",
        zip: data?.zip ? data?.zip : "",
        toll_number: data?.toll_number ? data?.toll_number : "",
        copyright: data?.copyright ? data?.copyright : "",
        gst_registration_no: data?.gst_registration_no,
        twitter: data?.twitter ? data?.twitter : "",
        facebook: data?.facebook ? data?.facebook : "",
        instagram: data?.instagram ? data?.instagram : "",
      };

      return res.send({
        message: "Success",
        success: true,
        data: response,
        mediaUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error getting Web Setting Data: " + error.message,
      });
    }
  };
  //#endregion get web settings data

  //#region contact us
  static contactus = async (req, res) => {
    try {
      const data = req.body;

      if (!req.body.name) {
        return res.status(400).send({
          message: "Please fill name",
        });
      } else if (!req.body.email) {
        return res.status(400).send({
          message: "Please fill email",
        });
      } else if (!req.body.phone) {
        return res.status(400).send({
          message: "Please fill phone number",
        });
      } else if (!req.body.subject) {
        return res.status(400).send({
          message: "Please fill subject",
        });
      }

      const contactus = await Contactus({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        privacy_policy: data.privacy_policy,
      });
      await contactus.save();
      return res.send({
        message: "Thank you for contacting us!! We will get back to you soon.",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static get_contactus = async (req, res) => {
    try {
      const contact = await Contactus.find({});
      return res.send({
        message: "Success",
        success: true,
        data: contact,
      });
    } catch (error) {
      console.log(error);
      return res.send(
        "Something went wrong please try again later",
        error.message
      );
    }
  };
  //#endregion contact us

  //region get all Stores
  static get_all_stores = async (req, res) => {
    try {
      const stores = await Store.find({})
        .sort({ created_at: -1 })
        .select("_id name phone address city state pincode url");

      if (!stores || stores.length === 0) {
        return res.send({
          message: "No stores found",
          success: true,
        });
      }

      return res.send({
        message: "Success",
        success: true,
        data: stores,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error getting all stores " + error.message,
      });
    }
  };
  //#endregion get all Stores

  //#region get all products
  static get_all_products = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/product/";
      const products = await Product.find({})
        .sort({ created_at: -1 })
        .populate("category_id unit_id");

      if (!products || products.length === 0) {
        return res.send({
          message: "No products found",
          success: true,
        });
      }

      const responseData = products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          // door_code removed
          size: product.size,
          sku: product.sku,
          // thickness removed
          // pannel_thickness removed
          sale_price: product.sale_price,
          purchase_price: product.purchase_price,
          distributor_price: product.distributor_price,
          dealer_price: product.dealer_price,
          mrp: product.mrp,
          production_cost: product.production_cost,
          quantity: product.quantity,
          unit_id: product.unit_id ? product.unit_id.name : null,
          tax: product.tax,
          category_id: product.category_id ? product.category_id.name : null,
          type: product.type,
          description: product.description,
          image: product.image,
          product_images: product.product_images,
          status: product.status,
          visibility_status: product.visibility_status,
        };
      });

      return res.send({
        message: "Success",
        success: true,
        data: responseData,
        mediaUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error getting all products " + error.message,
      });
    }
  };
  //#endregion get all products

  //#region products_by_category
  static products_by_category = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/product/";

      const _id = req.query._id;
      if (!_id) {
        return res.status(400).send({
          message: "Category ID is required",
        });
      }

      const products = await Product.find({ category_id: _id })
        .sort({ created_at: -1 })
        .populate("category_id unit_id");

      if (!products || products.length === 0) {
        return res.send({
          message: "No products found for this category",
          success: true,
        });
      }

      const responseData = products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          // door_code removed
          size: product.size,
          sku: product.sku,
          // thickness removed
          // pannel_thickness removed
          sale_price: product.sale_price,
          purchase_price: product.purchase_price,
          distributor_price: product.distributor_price,
          dealer_price: product.dealer_price,
          mrp: product.mrp,
          production_cost: product.production_cost,
          quantity: product.quantity,
          unit_id: product.unit_id ? product.unit_id.name : null,
          tax: product.tax,
          category_id: product.category_id ? product.category_id.name : null,
          type: product.type,
          description: product.description,
          image: product.image,
          product_images: product.product_images,
          status: product.status,
          visibility_status: product.visibility_status,
        };
      });
      if (responseData.length === 0) {
        return res.send({
          message: "No products found for this category",
          success: true,
        });
      }
      return res.send({
        message: "Success",
        success: true,
        data: responseData,
        mediaUrl,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };
  //#endregion products_by_category

  //#region get_gallery_categories
  static get_gallery_categories = async (req, res) => {
    let mediaUrl = baseURL + "/uploads/galleryCategory/";
    try {
      const categories = await GalleryCategory.find().sort({ name: 1 });

      if (!categories || categories.length === 0) {
        return res.send({
          message: "No categories found",
          success: true,
        });
      }
      const responseData = categories.map((category) => {
        return {
          _id: category._id,
          name: category.name,
          icon: category.icon,
        };
      });

      return res.send({
        message: "Success",
        success: true,
        data: responseData,
        mediaUrl,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };
  //#endregion get_gallery_categories

  //#region get_gallery
  static get_gallery = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/gallery/";
      const gallery = await Gallery.find({})
        .sort({ created_at: -1 })
        .populate("gallery_category_id");

      if (!gallery || gallery.length === 0) {
        return res.send({
          message: "No gallery items found",
          success: true,
        });
      }

      return res.send({
        message: "Success",
        success: true,
        data: gallery,
        mediaUrl,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error getting gallery items " + error.message,
      });
    }
  };
  //#endregion get_gallery

  //#region get_gallery_by_category
  static get_gallery_by_category = async (req, res) => {
    try {
      let mediaUrl = baseURL + "/uploads/gallery/";

      const _id = req.query._id;
      if (!_id) {
        return res.status(400).send({
          message: "Gallery Category ID is required",
        });
      }

      const gallery = await Gallery.find({ gallery_category_id: _id })
        .sort({ created_at: -1 })
        .populate("gallery_category_id");

      if (!gallery || gallery.length === 0) {
        return res.send({
          message: "No gallery items found for this category",
          success: true,
        });
      }

      return res.send({
        message: "Success",
        success: true,
        data: gallery,
        mediaUrl,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };
  //#endregion get_gallery_by_category

  // #region Billing Address
  static get_userBillingAddress = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      const billingAddresses = await UserBillingAddress.find({
        user_id: userId,
      }).populate("user_id");
      return res.send({
        success: true,
        status: 200,
        message: "Billing Address fetched successfully",
        data: billingAddresses,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };

  static add_userBillingAddress = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      const userBillingAddress = new UserBillingAddress({
        user_id: userId,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        address_type: req.body.address_type,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await userBillingAddress.save();

      return res.send({
        success: true,
        status: 200,
        message: "Billing Address added successfully",
        data: userBillingAddress,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  };

  static update_userBillingAddress = async (req, res) => {
    try {
      const billing_id = req.body.billing_id;
      // Middleware NotLoggedIn validates token and sets req.id

      const user = await UserBillingAddress.findOne({
        _id: billing_id,
        user_id: req.id, // IDOR FIX: Check ownership
      });

      if (!user) {
        return res.send({
          message: "User not found",
          status: 404,
          success: false,
        });
      }

      let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        address_type: req.body.address_type,
        updated_at: new Date(),
      };

      const updatedData = await UserBillingAddress.findOneAndUpdate(
        { _id: billing_id, user_id: req.id }, // IDOR FIX: Check ownership
        data
      );

      return res.send({
        success: true,
        status: 200,
        message: "Billing Address updated successfully",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };

  static delete_userBillingAddress = async (req, res) => {
    try {
      const { id } = req.query;
      // IDOR FIX: Check ownership
      const deletedAddress = await UserBillingAddress.findOneAndDelete({
        _id: id,
        user_id: req.id,
      });

      if (!deletedAddress) {
        return res.status(400).send({ message: "Id not found" });
      }

      return res.send({
        success: true,
        status: 200,
        message: "Billing Address deleted successfully",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };

  static makeDefault_userBillingAddress = async (req, res) => {
    try {
      const { id } = req.query;

      // Set all other addresses' `is_default` to false FOR THIS USER ONLY
      await UserBillingAddress.updateMany(
        { user_id: req.id, is_default: true },
        { is_default: false }
      );

      // Set the selected address' `is_default` to true
      const updatedAddress = await UserBillingAddress.findOneAndUpdate(
        { _id: id, user_id: req.id }, // IDOR FIX: Check ownership
        { is_default: true },
        { new: true }
      );

      if (!updatedAddress) {
        return res.send({ message: "Address not found" });
      }

      return res.send({
        success: true,
        status: 200,
        message: "Default Billing Address set successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        success: false,
        message: "Error: " + error.message,
      });
    }
  };

  static getDefault_userBillingAddress = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      const billingAddress = await UserBillingAddress.findOne({
        user_id: userId,
        is_default: true,
      });

      if (!billingAddress) {
        return res.send({
          success: true,
          message: "No default billing address found",
        });
      }

      return res.send({
        success: true,
        status: 200,
        message: "Default Billing Address fetched successfully",
        data: billingAddress,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };
  // #endregion Billing Address

  // #region Orders
  static getOrders = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      const orders = await Order.find({ user_id: userId })
        .select(" -updated_at -__v")
        .populate("user_id", "name email phone address city state pincode");

      return res.send({
        success: true,
        status: 200,
        message: "Order fetched successfully",
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };

  static orderItems = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "Unauthorized access",
        });
      }

      const productMediaUrl = baseURL + "/uploads/product/";

      const orders = await Order.find({ user_id: userId });
      const orderIds = orders.map((order) => order._id);

      const orderHistories = await OrderHistory.find({
        order_id: { $in: orderIds },
      })
        .populate({
          path: "product_id",
          select: "door_name size mrp quantity category_id image",
        })
        .populate({
          path: "order_id",
          select:
            "order_total_amount order_subtotal_amount payment_status status order_date",
        })
        .populate("user_id", "name email phone address city state pincode")
        .select("-created_at -updated_at -__v")
        .lean();

      return res.status(200).send({
        success: true,
        message: "Order Items fetched successfully",
        data: orderHistories,
        productMediaUrl,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).send({
        success: false,
        message: "Error fetching data: " + error.message,
      });
    }
  };

  static get_transactions = async (req, res) => {
    try {
      // Middleware NotLoggedIn validates token and sets req.id
      const userId = req.id;

      let transactions = await Transaction.find({ user_id: userId })
        .select("-created_at -updated_at -__v")
        .populate("user_id", "name email phone address city state pincode")
        .populate(
          "order_id",
          "_id order_total_amount payment_status payment_mode"
        );
      return res.send({
        success: true,
        status: 200,
        message: "Transaction fetched successfully",
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.send({
        success: false,
        status: 500,
        message: "Error fetching data" + error.message,
      });
    }
  };

  // #endregion Orders
}

module.exports = WebsiteController;
