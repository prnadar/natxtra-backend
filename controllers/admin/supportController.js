const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const SupportTicket = require("../../models/SupportTicket");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");

class SupportController {
  static dashboard = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });

      const users = await User.find().populate("role").lean();

      // Build filter object
      const filter = {};
      if (req.query.priority) filter.priority = req.query.priority;
      if (req.query.status) filter.status = req.query.status;

      // Only show assigned tickets for non-admins
      if (!req.isAdmin) {
        filter.assign_to = req.user._id;
      }

      // Pagination logic
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const totalItems = await SupportTicket.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / pageSize);

      const supportTickets = await SupportTicket.find(filter)
        .populate("user_id")
        .sort({ created_at: -1 }) // Optional: Sort newest first
        .skip(skip)
        .limit(pageSize)
        .lean();

      return res.render("admin/support-ticket-list", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "support",
        users,
        supportTickets,
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
        priority: req.query.priority || "",
        status: req.query.status || "",
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong, please try again later.");
    }
  };

  static createSupportTicket = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        if (err) {
          return res.status(400).send({
            message: "Error uploading files: " + err.message,
          });
        }
        if (req.fileValidationError) {
          return res.status(400).send({
            message: req.fileValidationError,
          });
        }

        const data = req.body;
        const files = req.files || {};

        const insertRecord = new SupportTicket({
          subject: data.subject,
          user_id: data.user_id,
          priority: data.priority,
          end_date: data.end_date,
          description: data.description.replace(/<\/?[^>]+(>|$)/g, ""),
          images: Array.isArray(files.images)
            ? files.images.map((f) => f.filename)
            : files.images
            ? [files.images[0].filename]
            : [],
        });
        await insertRecord.save();
        return res.send({
          status: 200,
          message: "Support Ticket Created Successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error creating Support Ticket: " + error.message,
      });
    }
  };

  static getReplyTicket = async (req, res) => {
    try {
      const ticket = await SupportTicket.findById(req.params.id)
        .populate("user_id")
        .populate("replies.user_id")
        .populate("replies.admin_id")
        .lean();

      return res.render("admin/support-ticket-reply", {
        supportTicket: ticket,
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "support",
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong, please try again later");
    }
  };

  static postReplyTicket = async (req, res) => {
    try {
      const ticket = await SupportTicket.findById(req.params.id);
      if (!ticket)
        return res
          .status(404)
          .json({ success: false, message: "Ticket not found" });

      ticket.replies.push({
        comment: req.body.comment,
        user_id: req.user._id,
        admin_id: req.user._id,
        created_at: new Date(),
      });

      await ticket.save();

      return res.json({ success: true, message: "Reply added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

  static assignSupportTicket = async (req, res) => {
    try {
      const { tickets, assignTo } = req.body;

      // Find the user to whom the tickets are being assigned
      const user = await User.findById(assignTo);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      // Update the tickets with the assigned user
      await SupportTicket.updateMany(
        { _id: { $in: tickets } },
        { $set: { assign_to: assignTo } }
      );

      res.status(200).json({
        success: true,
        message: "Support Tickets assigned successfully",
      });
    } catch (error) {
      console.error("Error in assigned tickets:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/support"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const imageFields = ["images"];
  if (imageFields.includes(file.fieldname)) {
    imageFilter(req, file, cb);
  }
};

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: fileFilter,
}).fields([{ name: "images", maxCount: 10 }]);

module.exports = SupportController;
