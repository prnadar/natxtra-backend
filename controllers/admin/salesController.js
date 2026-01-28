const multer = require("multer");
const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const Distributor = require("../../models/Distributor");
const Leads = require("../../models/Leads");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const root = process.cwd();
const fs = require("fs");
const {
  formDateToDateString,
  dateToString,
  stringToDate,
} = require("../../utils/dateHelper");

const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/excel"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.xlsx`);
  },
});

const profileImageStorage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/profile_images"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"));
  },
}).single("profileImage");

const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
}).single("excelFile");

const FILTERS = {
  unallocated: {
    $or: [{ allocated_to: null }, { allocated_to: { $exists: false } }],
  },
  hot_lead: { subdescription: "hot_lead" },
  not_open: { description: "not_open" },
  no_response: { description: "no_response" },
  call_back: { query_status: "call_back" },
  client_meeting: { description: "client_meeting" },
  present_call: { description: "present_call" },
  today_followup: { query_status: "today_followup" },
  presentation: { query_status: "presentation" },
  prospect: { query_status: "prospect" },
  deal_done: { query_status: "deal_done" },
  not_interested: { query_status: "not_interested" },
  non_contactable: { description: "non_contactable" },
  become_distibutor: { description: "become_distibutor" },
  payment: { description: "payment" },
  prospect_fu: { query_status: "prospect_fu" },
  presentation_fu: { query_status: "presentation_fu" },
};

class SalesController {
  static dashboard = async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const users = await User.find().populate("role").lean();

      // Fetch latest 10 leads sorted by date (descending)
      const latestLeads = await Leads.find({ contact_person: { $ne: null } })
        .sort({ date: -1, _id: -1 }) // latest first
        .limit(10)
        .lean();

      // Initialize map for per-user stats
      const userStatsMap = {};

      for (const lead of latestLeads) {
        const userName = lead.contact_person || "Unnamed";

        if (!userStatsMap[userName]) {
          userStatsMap[userName] = {
            call_back: 0,
            follow_up: 0,
            not_interested: 0,
            presentation: 0,
            payment: 0,
            become_distibutor: 0,
            deal_done: 0,
            prospect: 0,
          };
        }

        // Map the statuses according to your rules
        const statusMap = {
          call_back: "call_back", // from subdescription
          follow_up: "follow_up", // from description
          not_interested: "not_interested", // from description
          presentation: "presentation", // from subdescription
          payment: "payment", // from description
          become_distibutor: "become_distibutor", // from description
          deal_done: "deal_done", // from description
          prospect: "prospect", // from description
        };

        for (const key in statusMap) {
          const sourceField =
            key === "call_back" || key === "presentation"
              ? lead.subdescription
              : lead.description;

          if (sourceField && sourceField === statusMap[key]) {
            userStatsMap[userName][key] += 1;
          }
        }
      }

      // Convert map to array for EJS
      const userStats = Object.keys(userStatsMap).map((name) => ({
        name,
        ...userStatsMap[name],
      }));

      return res.render("admin/sales-dash", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "sales",
        from: today,
        to: today,
        userStats,
        users,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static leadListing = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const filterKey = req.query.filter || "";
      const from = req.query.from;
      const to = req.query.to;

      const match = { ...(FILTERS[filterKey] || {}) };

      // User-based filtering
      if (!req.isAdmin) {
        match.assign_to_user = req.user._id;
      }

      // Date range filtering
      if (from && to) {
        const fromFormatted = from.split("-").reverse().join("/");
        const toFormatted = to.split("-").reverse().join("/");
        match.date = { $gte: fromFormatted, $lte: toFormatted };
      }

      const totalItems = await Leads.countDocuments(match);
      const totalPages = Math.ceil(totalItems / pageSize);

      const leads = await Leads.find(match)
        .sort({ date: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const [admins, users, distributors, countsArr] = await Promise.all([
        Adminauth.find(),
        User.find().populate("role").lean(),
        Distributor.find().lean(),
        Promise.all(
          Object.entries(FILTERS).map(([key, cond]) => {
            const countMatch = req.isAdmin
              ? cond
              : { ...cond, assign_to_user: req.user._id };
            return Leads.countDocuments(countMatch).then((c) => [key, c]);
          })
        ),
      ]);

      const counts = Object.fromEntries(countsArr);

      // Optional: Load lead profile if needed
      let profile = null;
      if (req.query.pid) {
        profile = await Leads.findById(req.query.pid);
      }

      const tab = req.query.tab || null;

      return res.render("admin/lead-listing", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "sales",
        admins,
        users,
        distributors,
        leads,
        profile,
        tab,
        counts,
        currentFilter: filterKey,
        from: from || "",
        to: to || "",
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("Something went wrong, please try again later.");
    }
  };

  static addLead = async (req, res) => {
    try {
      req.body.date = formDateToDateString(req.body.date);
      if (req.body.next_call)
        req.body.next_call = formDateToDateString(req.body.next_call);

      // Get latest profile_id number
      const lastLead = await Leads.findOne({})
        .sort({ profile_id: -1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .lean();

      let newNumber = 1;
      if (lastLead && lastLead.profile_id) {
        const lastNumber = parseInt(lastLead.profile_id.split("-")[1]);
        newNumber = lastNumber + 1;
      }

      // Format: EZ-0001
      req.body.profile_id = `EZ-${String(newNumber).padStart(4, "0")}`;

      req.body.activities = [
        {
          date: new Date(),
          followup_date: req.body.next_call,
          description: req.body.description,
          subdescription: req.body.subdescription,
          product_name: req.body.product_name,
          price: req.body.price,
          remarks: req.body.remarks,
          createdBy: req.user._id,
        },
      ];
      const lead = new Leads(req.body);
      await lead.save();

      res
        .status(200)
        .send({ message: "Lead Created Successfully.", error: false });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static editLead = async (req, res) => {
    try {
      req.body.date = formDateToDateString(req.body.date);
      if (req.body.next_call)
        req.body.next_call = formDateToDateString(req.body.next_call);
      const existingLead = await Leads.findById(req.body.id);
      if (existingLead) {
        req.body.activities = existingLead.activities;
      }
      const updatedLead = await Leads.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedLead) {
        return res.status(404).send({
          message: "Lead not found.",
          error: true,
        });
      }
      res.status(200).send({
        message: "Lead Updated Successfully.",
        error: false,
        data: updatedLead,
      });
    } catch (err) {
      console.error(err);
    }
  };

  static deleteLead = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid or missing Lead ID.",
          error: true,
        });
      }

      await Leads.findByIdAndDelete(id);
      res
        .status(200)
        .send({ message: "Lead Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Lead Deletion Failed.", error: true });
    }
  };

  // Delete multiple leads
  static deleteLeads = async (req, res) => {
    try {
      const ids = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send({
          message: "No leads selected for deletion.",
          error: true,
        });
      }

      const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        return res.status(400).send({
          message: "No valid lead IDs provided.",
          error: true,
        });
      }

      await Leads.deleteMany({ _id: { $in: validIds } });

      res
        .status(200)
        .send({ message: "Leads Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Bulk Lead Deletion Failed.", error: true });
    }
  };

  static addXlsxLeads = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          message: "Error Uploading File",
          error: true,
        });
      }

      const filePath = req.file.path;

      try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        fs.unlinkSync(filePath);

        // Get last profile_id
        const lastLead = await Leads.findOne({})
          .sort({ profile_id: -1 })
          .collation({ locale: "en_US", numericOrdering: true })
          .lean();

        let currentNumber = 1;
        if (lastLead?.profile_id) {
          const lastNumber = parseInt(lastLead.profile_id.split("-")[1]);
          currentNumber = lastNumber + 1;
        }

        const requiredFields = [
          "looking_for",
          "contact_person",
          "default_phone",
          "email",
          "company_name",
          "city",
          "message",
          "query_status",
        ];

        const validLeads = [];
        const skippedLeads = [];

        data.forEach((lead, index) => {
          const profile_id = `EZ-${String(currentNumber++).padStart(4, "0")}`;

          // Convert date fields
          try {
            if (lead.date) {
              lead.date = formDateToDateString(lead.date);
            }
            if (lead.next_call) {
              lead.next_call = formDateToDateString(lead.next_call);
            }
          } catch (e) {
            console.warn(`Invalid date in row ${index + 2}`, e);
          }

          // Validate required fields
          const isValid = requiredFields.every(
            (field) => lead[field] && lead[field].toString().trim() !== ""
          );

          if (isValid) {
            lead.activities = [
              {
                date: new Date(),
                followup_date: lead.next_call,
                description: lead.description,
                subdescription: lead.subdescription,
                product_name: lead.product_name,
                price: lead.price,
                remarks: lead.remarks,
                createdBy: req.user._id,
              },
            ];

            validLeads.push({
              ...lead,
              profile_id,
            });
          } else {
            skippedLeads.push({ row: index + 2, data: lead });
            console.warn(
              `Skipping row ${index + 2} due to missing required fields`,
              lead
            );
          }
        });

        if (validLeads.length > 0) {
          await Leads.insertMany(validLeads);
        }

        return res.status(200).send({
          message: `Upload Complete: ${validLeads.length} leads inserted, ${skippedLeads.length} skipped.`,
          skippedRows: skippedLeads,
          error: false,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send({
          message: "Error Processing File",
          error: true,
        });
      }
    });
  };

  static allocateLeadListing = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;

      const [admins, users, distributors] = await Promise.all([
        Adminauth.find(),
        User.find().populate("role").lean(),
        Distributor.find().lean(), // Add this to fetch distributors
      ]);

      // ... existing filter and query logic ...
      const filterKey = req.query.filter || "";
      const match = FILTERS[filterKey] || {};

      const totalItems = await Leads.countDocuments(match);
      const totalPages = Math.ceil(totalItems / pageSize);
      let leadsPromise = Leads.find(match)
        .populate("allocated_to")
        .sort({ date: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      // 🟢 Apply date filter if present
      const from = req.query.from;
      const to = req.query.to;

      if (from && to) {
        const fromFormatted = from.split("-").reverse().join("/"); // Convert to DD/MM/YYYY
        const toFormatted = to.split("-").reverse().join("/"); // Convert to DD/MM/YYYY

        // Apply the date filter based on the formatted dates
        leadsPromise = leadsPromise
          .where("date")
          .gte(fromFormatted)
          .lte(toFormatted);
      }

      // 2️⃣ Get counts for all filters in parallel
      const countsPromise = Promise.all(
        Object.entries(FILTERS).map(([key, cond]) =>
          Leads.countDocuments(cond).then((c) => [key, c])
        )
      );

      const [leads, countsArr] = await Promise.all([
        leadsPromise,
        countsPromise,
      ]);
      const counts = Object.fromEntries(countsArr);

      let profile = null;
      let tab = null;
      if (req.query.pid) {
        profile = await Leads.findById(req.query.pid);
      }
      if (req.query.tab) {
        tab = req.query.tab;
      }

      return res.render("admin/allocate-lead-listing", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "sales", // Added pageId parameter
        admins,
        users,
        distributors,
        leads,
        profile,
        tab,
        counts,
        currentFilter: filterKey,
        from: from || "",
        to: to || "",
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static assignLead = async (req, res) => {
    try {
      const { leads, assignToUser, assignToDistributor } = req.body;

      if (!leads || !Array.isArray(leads) || leads.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No leads selected." });
      }

      if (!assignToUser && !assignToDistributor) {
        return res.status(400).json({
          success: false,
          message: "Please select a user or distributor to assign.",
        });
      }

      const updateData = {};
      if (assignToUser) updateData.assign_to_user = assignToUser;
      else updateData.assign_to_user = null; // Clear if not provided

      if (assignToDistributor)
        updateData.assign_to_distributor = assignToDistributor;
      else updateData.assign_to_distributor = null; // Clear if not provided

      await Leads.updateMany({ _id: { $in: leads } }, { $set: updateData });

      res.json({ success: true, message: "Leads successfully assigned." });
    } catch (error) {
      console.error("Assignment error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during lead assignment.",
      });
    }
  };

  static addProduct = async (req, res) => {
    try {
      const { id, product_name, category, keywords } = req.body;

      if (!id || !product_name) {
        return res.status(400).send({
          message: "Lead ID and Product Name are required",
          error: true,
        });
      }

      const product = { product_name, category, keywords };

      await Leads.findByIdAndUpdate(
        id,
        { $push: { products: product } },
        { new: true }
      );

      res.status(200).send({
        message: "Product added successfully",
        error: false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to add product",
        error: true,
      });
    }
  };

  static getProducts = async (req, res) => {
    try {
      const { id } = req.params;
      const lead = await Leads.findById(id).select("products");

      if (!lead) {
        return res.status(404).send({
          message: "Lead not found",
          error: true,
        });
      }

      res.status(200).send({
        products: lead.products,
        error: false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to fetch products",
        error: true,
      });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const { leadId, productId } = req.body;

      await Leads.findByIdAndUpdate(leadId, {
        $pull: { products: { _id: productId } },
      });

      res.status(200).send({
        message: "Product deleted successfully",
        error: false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to delete product",
        error: true,
      });
    }
  };

  static uploadProfileImage = async (req, res) => {
    try {
      uploadProfileImage(req, res, async (err) => {
        if (err) {
          return res.status(400).send({
            message: err.message,
            error: true,
          });
        }

        if (!req.file) {
          return res.status(400).send({
            message: "No file uploaded",
            error: true,
          });
        }

        const { leadId } = req.body;

        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const imagePath = `/uploads/profile_images/${req.file.filename}?t=${timestamp}`;

        // Update the lead with the new image path
        await Leads.findByIdAndUpdate(leadId, {
          profileImage: {
            path: `/uploads/profile_images/${req.file.filename}`,
            filename: req.file.filename,
          },
        });

        res.status(200).send({
          message: "Profile image uploaded successfully",
          imagePath: imagePath, // Send the timestamped version to client
          error: false,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to upload profile image",
        error: true,
      });
    }
  };

  static getLeadDetails = async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid lead ID",
          error: true,
        });
      }

      const lead = await Leads.findById(id).lean();

      if (!lead) {
        return res.status(404).send({
          message: "Lead not found",
          error: true,
        });
      }
      if (lead.activities && lead.activities.length > 0) {
        lead.activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        lead.lastActivitiesDate = lead.activities[0].date;
      }

      res.status(200).send({
        data: lead,
        error: false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to fetch lead details",
        error: true,
      });
    }
  };

  // Add this to your SalesController class
  static updateRemarks = async (req, res) => {
    try {
      const {
        id,
        remarks,
        description,
        subdescription,
        product_name,
        price,
        followup_date,
      } = req.body;

      // Create new activity object
      const newActivity = {
        date: new Date(),
        followup_date: followup_date
          ? formDateToDateString(followup_date)
          : undefined,
        description,
        subdescription,
        product_name,
        price,
        remarks,
        createdBy: req.user._id,
      };

      // Update lead with latest remarks and push to activities array
      const updatedLead = await Leads.findByIdAndUpdate(
        id,
        {
          $set: {
            remarks,
            description,
            subdescription,
            product_name,
            price,
            followup_date: followup_date
              ? formDateToDateString(followup_date)
              : undefined,
            updatedAt: new Date(),
          },
          $push: { activities: newActivity },
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Remarks and activity updated successfully",
        data: updatedLead,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
module.exports = SalesController;
