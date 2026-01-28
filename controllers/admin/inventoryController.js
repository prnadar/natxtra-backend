const Adminauth = require("../../models/Adminauth");
const Product = require("../../models/Product");
const Unit = require("../../models/Unit");
const Category = require("../../models/Category");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");

class InventoryController {
  // Helper function to parse tax data from form (supports both old and new format)
  static parseTaxData(reqBody) {
    // Check if new tax format fields exist (checkboxes or percentage fields)
    const hasNewTaxFormat =
      'tax_cgst_enabled' in reqBody ||
      'tax_sgst_enabled' in reqBody ||
      'tax_igst_enabled' in reqBody ||
      'tax_cgst_percentage' in reqBody ||
      'tax_sgst_percentage' in reqBody ||
      'tax_igst_percentage' in reqBody ||
      'edit_tax_cgst_enabled' in reqBody ||
      'edit_tax_sgst_enabled' in reqBody ||
      'edit_tax_igst_enabled' in reqBody ||
      'edit_tax_cgst_percentage' in reqBody ||
      'edit_tax_sgst_percentage' in reqBody ||
      'edit_tax_igst_percentage' in reqBody;

    if (hasNewTaxFormat) {
      const taxObj = {};

      // Handle both add and edit form field names
      // Checkboxes send 'on' when checked, or don't exist when unchecked
      const cgstEnabled = reqBody.tax_cgst_enabled === 'on' || reqBody.edit_tax_cgst_enabled === 'on';
      const sgstEnabled = reqBody.tax_sgst_enabled === 'on' || reqBody.edit_tax_sgst_enabled === 'on';
      const igstEnabled = reqBody.tax_igst_enabled === 'on' || reqBody.edit_tax_igst_enabled === 'on';

      // Get percentage values (they might be empty strings if disabled)
      const cgstPercentage = (reqBody.tax_cgst_percentage || reqBody.edit_tax_cgst_percentage || '').toString().trim();
      const sgstPercentage = (reqBody.tax_sgst_percentage || reqBody.edit_tax_sgst_percentage || '').toString().trim();
      const igstPercentage = (reqBody.tax_igst_percentage || reqBody.edit_tax_igst_percentage || '').toString().trim();

      // Only add tax if checkbox is enabled AND percentage is provided and valid
      if (cgstEnabled && cgstPercentage && !isNaN(parseFloat(cgstPercentage)) && parseFloat(cgstPercentage) > 0) {
        taxObj.cgst = { percentage: parseFloat(cgstPercentage) };
      }
      if (sgstEnabled && sgstPercentage && !isNaN(parseFloat(sgstPercentage)) && parseFloat(sgstPercentage) > 0) {
        taxObj.sgst = { percentage: parseFloat(sgstPercentage) };
      }
      if (igstEnabled && igstPercentage && !isNaN(parseFloat(igstPercentage)) && parseFloat(igstPercentage) > 0) {
        taxObj.igst = { percentage: parseFloat(igstPercentage) };
      }

      // Return null if no tax is configured, otherwise return the tax object
      return Object.keys(taxObj).length > 0 ? taxObj : null;
    }

    // Fall back to old format for backward compatibility
    return reqBody.tax || reqBody.edit_tax || null;
  }

  static dashboard = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });

      // total products
      const totalProducts = await Product.countDocuments();

      // Low Stock items
      const lowStockItems = await Product.find({
        status: "Low Stock",
      }).countDocuments();

      // Out of Stock items
      const outOfStockItems = await Product.find({
        status: "Out of Stock",
      }).countDocuments();

      // Total inventory value (based on purchase price × quantity)
      const inventoryValueResult = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ["$quantity", "$mrp"] },
            },
          },
        },
      ]);

      const totalInventoryValue =
        inventoryValueResult.length > 0
          ? inventoryValueResult[0].totalValue
          : 0;

      return res.render("admin/inventory-Dash", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "inventory", // Added pageId parameter
        totalProducts,
        lowStockItems,
        outOfStockItems,
        totalInventoryValue,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static productManage = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      const filter = {};

      // Category filter
      if (req.query.category_id) {
        filter.category_id = req.query.category_id;
      }

      // Stock status filter: We need to filter status
      if (req.query.status) {
        filter.status = req.query.status;
      }

      if (req.query.brand_name) {
        filter.brand_name = req.query.brand_name;
      }

      // Fetch products based on filters
      const products = await Product.find(filter)
        .populate("unit_id")
        .populate("category_id")
        .sort({ created_at: -1 });

      // Fetch units and categories
      const units = await Unit.find();
      const categories = await Category.find();

      // Pass selected filters to the template
      const selectedCategory = req.query.category_id || "";
      const selectedStatus = req.query.status || "";
      const selectedBrand = req.query.brand_name || "";

      // Render the page
      return res.render("admin/products-manage", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "inventory",
        products,
        units,
        categories,
        selectedCategory,
        selectedStatus,
        selectedBrand,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong, please try again later.");
    }
  };

  static addProduct = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        } else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }

        const insertRecord = Product({
          image: req.files["image"] ? req.files["image"][0].filename : null,
          product_images: req.files["product_images"]
            ? req.files["product_images"].map((file) => file.filename)
            : [],
          name: req.body.name,
          // door_code removed
          size: Array.isArray(req.body.size) ? req.body.size : [req.body.size],
          sku: req.body.sku,
          // thickness removed
          // pannel_thickness removed
          sale_price: req.body.sale_price,
          // purchase_price: req.body.purchase_price,
          distributor_price: req.body.distributor_price,
          dealer_price: req.body.dealer_price,
          mrp: req.body.mrp,
          // production_cost: req.body.production_cost,
          quantity: req.body.quantity,
          unit_id: req.body.unit_id,
          tax: InventoryController.parseTaxData(req.body),
          category_id: req.body.category_id,
          brand_name: req.body.brand_name,
          type: req.body.type,
          description: req.body.description,
          status: req.body.status,
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Product added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error creating Product: " + error.message });
    }
  };

  static editProduct = async (req, res) => {
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

        const product = await Product.findOne({
          _id: req.body.editid,
        });
        if (!product) {
          return res.status(404).send({ message: "editid not found" });
        }
        const validTypes = ["Product", "Service"];
        const updatedData = {
          name: req.body.edit_name,
          // door_code removed
          size: Array.isArray(req.body.edit_size) ? req.body.edit_size : [req.body.edit_size],
          sku: req.body.edit_sku,
          // thickness removed
          // pannel_thickness removed
          sale_price: req.body.edit_sale_price,
          // purchase_price: req.body.edit_purchase_price,
          distributor_price: req.body.edit_distributor_price,
          dealer_price: req.body.edit_dealer_price,
          mrp: req.body.edit_mrp,
          // production_cost: req.body.edit_production_cost,
          quantity: req.body.edit_quantity,
          unit_id: req.body.edit_unit_id,
          tax: InventoryController.parseTaxData(req.body),
          category_id: req.body.edit_category_id,
          brand_name: req.body.edit_brand_name,
          type: validTypes.includes(req.body.edit_type)
            ? req.body.edit_type
            : "Product",
          description: req.body.edit_description,
          status: req.body.edit_status,
          updated_at: new Date(),
        };

        if (req.file) {
          updatedData.image = req.file ? req.file.filename : null;
          updatedData.product_images = req.body.product_images
            ? req.body.product_images
            : [];
        }
        await Product.findOneAndUpdate({ _id: req.body.editid }, updatedData, {
          new: true,
        });

        if (req.file && product.image) {
          fs.unlink(
            path.join(root, "/public/uploads/product/" + product.image),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.product_images && product.product_images) {
          product.product_images.forEach((image) => {
            fs.unlink(
              path.join(root, "/public/uploads/product/" + image),
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          });
        }
        return res.send({
          status: 200,
          message: "Product updated successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error updating Product: " + error.message });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Product Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Product Deletion Failed.", error: true });
    }
  };

  static deleteProducts = async (req, res) => {
    try {
      await Product.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Product Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Product Deletion Failed.", error: true });
    }
  };

  static productStockList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await Product.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const admin = await Adminauth.findOne({ email: req.session.email });
      const products = await Product.find()
        .populate("unit_id")
        .populate("category_id")
        .sort({ created_at: -1 });

      return res.render("admin/products-stock-list", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "inventory", // Added pageId parameter
        products,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static updateQuantity = async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.body.editid,
      });
      if (!product) {
        return res.status(404).send({ message: "editid not found" });
      }

      const updatedData = {
        quantity: req.body.edit_quantity,
        updated_at: new Date(),
      };

      await Product.findOneAndUpdate({ _id: req.body.editid }, updatedData, {
        new: true,
      });

      return res.send({
        status: 200,
        message: "Product quantity updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error updating Product quantity: " + error.message });
    }
  };
}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/product"),
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
}).fields([
  { name: "image", maxCount: 1 },
  { name: "product_images", maxCount: 10 },
]);

const editupload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).fields([
  { name: "editimage", maxCount: 1 },
  { name: "edit_product_images", maxCount: 10 },
]);

module.exports = InventoryController;
