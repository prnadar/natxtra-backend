const Category = require("../../models/Category");
const Product = require("../../models/Product");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");

class CategoryController {
  static list = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;

      const totalItems = await Category.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const categories = await Category.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.render("admin/category", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        categories,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error fetching categories: " + error.message,
      });
    }
  };

  static add = async (req, res) => {
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

        const insertRecord = Category({
          icon: req.file ? req.file.filename : null,
          name: req.body.name,
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Category added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error creating category: " + error.message });
    }
  };

  static edit = async (req, res) => {
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

        const category = await Category.findOne({
          _id: req.body.editid,
        });
        if (!category) {
          return res.status(404).send({ message: "editid not found" });
        }

        const updatedData = {
          name: req.body.edit_name,
          updated_at: new Date(),
        };

        if (req.file) {
          updatedData.icon = req.file ? req.file.filename : null;
        }
        await Category.findOneAndUpdate({ _id: req.body.editid }, updatedData, {
          new: true,
        });

        if (req.file && category.icon) {
          fs.unlink(
            path.join(root, "/public/uploads/category/" + category.icon),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        return res.send({
          status: 200,
          message: "Category updated successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error updating category: " + error.message });
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const categoryId = req.body.id;

      // Check if any products are using this category
      const productCount = await Product.countDocuments({
        category_id: categoryId,
      });

      if (productCount > 0) {
        return res.status(400).send({
          message: "Cannot delete category. Products exist in this category.",
          error: true,
        });
      }

      // No products found, safe to delete
      await Category.findByIdAndDelete(categoryId);

      res.status(200).send({
        message: "Category deleted successfully.",
        error: false,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Category deletion failed.",
        error: true,
      });
    }
  };
}

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/category"),
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
}).single("icon");

const editupload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("editicon");

module.exports = CategoryController;
