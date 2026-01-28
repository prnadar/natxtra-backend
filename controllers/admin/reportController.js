const Adminauth = require("../../models/Adminauth");
const Report = require("../../models/Report");
const Distributor = require("../../models/Distributor");
const User = require("../../models/User");
const Leave = require("../../models/Leave");
const SalarySlip = require("../../models/SalarySlip");
const OfficeCalender = require("../../models/OfficeCalender");
const Termination = require("../../models/Termination");
const Product = require("../../models/Product");
const PurchaseInvoice = require("../../models/PurchaseInvoice");
const SalesInvoice = require("../../models/SalesInvoice");
const EstimationInvoice = require("../../models/EstimationInvoice");
const Leads = require("../../models/Leads");
const Role = require("../../models/Role");
const Category = require("../../models/Category");
const PDFDocument = require("pdfkit");
const { dateToString } = require("../../utils/dateHelper");
const mongoose = require("mongoose");

class ReportController {
  static dashboard = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      return res.render("admin/report-dash", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports", // Added pageId parameter
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  //#region Sales Report
  static reportSales = async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const report = await Report.find({
        report_type: "sales",
      }).populate("user manager");
      const users = await User.find();
      const managerRole = await Role.findOne({ name: "Manager" });
      let managers = [];
      if (managerRole) {
        managers = await User.find({ role: managerRole._id });
      }
      return res.render("admin/report-sales", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports", // Added pageId parameter
        report,
        users,
        today,
        managers,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateSalesReport = async (req, res) => {
    try {
      const {
        report_type,
        all,
        user,
        manager,
        firm,
        date_range_from,
        date_range_to,
      } = req.body;

      if (!report_type || !date_range_from || !date_range_to) {
        return res.json({ success: false, message: "Missing required fields" });
      }

      const report = new Report({
        report_type,
        all: all || "",
        user: user || null,
        manager: manager || null,
        firm: firm || "",
        date_range_from,
        date_range_to,
      });

      await report.save();

      return res.json({
        success: true,
        message: "Report generated successfully",
      });
    } catch (err) {
      console.error("Error generating report:", err);
      return res.json({ success: false, message: "Internal server error" });
    }
  };

  static downloadSalesReport = async (req, res) => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id).populate("user", "name");
      if (!report) return res.status(404).send("Report not found");

      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const parseDDMMYYYY = (str) => {
        if (!str) return null;
        const [day, month, year] = str.split("/").map(Number);
        return new Date(year, month - 1, day);
      };

      // Fetch all leads
      let leads = await Leads.find().lean();

      // Filter by date range
      leads = leads.filter((lead) => {
        const leadDate = parseDDMMYYYY(lead.date);
        return leadDate && leadDate >= fromDate && leadDate <= toDate;
      });

      if (report.firm && report.firm.toLowerCase() !== "all") {
        leads = leads.filter((lead) => lead.brand_name === report.firm);
      }

      if (report.user) {
        leads = leads.filter((lead) =>
          lead.contact_person
            ?.toLowerCase()
            .includes(report.user.name.toLowerCase())
        );
      }

      if (report.manager) {
        const managerRole = await Role.findOne({ name: "Manager" });
        const managerUsers = await User.find({ role: managerRole._id }).select(
          "name"
        );
        const managerNames = managerUsers.map((u) => u.name).filter(Boolean);

        leads = leads.filter((lead) =>
          managerNames.includes(lead.contact_person)
        );
      }

      if (!leads.length)
        return res.send("No leads found for the selected filters");

      // ---------------- PDF Generation ----------------
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({
        margin: 15,
        size: "A3",
        layout: "landscape",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="sales_report_${Date.now()}.pdf"`
      );
      doc.pipe(res);

      doc.fontSize(16).text("Sales Leads Report", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(10)
        .text(
          `Report Type: ${report.report_type || "Sales"} | From: ${
            report.date_range_from
          } | To: ${report.date_range_to}`,
          { align: "center" }
        );
      doc.moveDown(1);

      const headers = [
        "Name",
        "Brand Name",
        "Profile ID",
        "Company Name",
        "Looking For",
        "Mobile",
        "Email",
        "City",
        "Message",
        "Follow-up",
        "Query Status",
        "Remarks",
        "Status",
      ];
      const columnWidths = [
        80, 70, 60, 80, 80, 80, 100, 70, 100, 70, 80, 90, 60,
      ];
      const startX = doc.x;
      let currentY = doc.y;
      const rowHeight = 22;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(7);
        rowData.forEach((text, i) => {
          doc.rect(x, y, columnWidths[i], rowHeight).stroke();
          doc.text(String(text || "-"), x + 2, y + 6, {
            width: columnWidths[i] - 4,
          });
          x += columnWidths[i];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      leads.forEach((lead) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage({ layout: "landscape" });
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          lead.contact_person,
          lead.brand_name,
          lead.profile_id,
          lead.company_name,
          lead.looking_for,
          lead.default_phone,
          lead.email,
          lead.city,
          lead.message,
          lead.followup_date,
          lead.query_status,
          lead.remarks,
          lead.status,
        ]);

        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("Error generating PDF:", err.message);
      res.status(500).send("Failed to generate sales report");
    }
  };
  //#endregion

  //#region Distributor Report
  static reportDistributor = async (req, res) => {
    try {
      const report = await Report.find({
        report_type: "distributor",
      }).populate("distributor distributor_type");
      const distributors = await Distributor.find();
      const role = await Role.find({
        name: { $in: ["Dealers"] },
      }).lean();
      const today = new Date().toISOString().split("T")[0];
      return res.render("admin/report-distributor", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports", // Added pageId parameter
        report,
        today,
        distributors,
        role,
        selectedDistributorType: "",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateDistributorReport = async (req, res) => {
    try {
      const {
        report_type,
        date_range_from,
        date_range_to,
        distributor,
        state,
        zone,
        distributor_type,
      } = req.body;

      if (!report_type || !date_range_from || !date_range_to) {
        return res.status(400).json({
          error: true,
          message: "Report Type and Date Range are required",
        });
      }

      // Ensure only one filter is selected
      const filters = [distributor, state, zone, distributor_type].filter(
        (v) => v
      );
      if (filters.length > 1) {
        return res
          .status(400)
          .json({ error: true, message: "Please select only one filter" });
      }

      const newReport = await Report.create({
        report_type,
        date_range_from,
        date_range_to,
        distributor: distributor || null,
        state: state || null,
        zone: zone || null,
        distributor_type: distributor_type || null,
      });

      return res.status(200).json({
        success: true,
        message: "Distributor report generated",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Failed to generate report" });
    }
  };

  static downloadDistributorReport = async (req, res) => {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);
      if (!report) return res.status(404).send("Report not found");

      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      toDate.setHours(23, 59, 59, 999); // ✅ full day include

      let filter = { createdAt: { $gte: fromDate, $lte: toDate } };

      // Apply extra filters
      if (report.distributor) {
        filter._id = report.distributor;
      } else if (report.state) {
        filter.state = report.state;
      } else if (report.zone) {
        filter.region = report.zone;
      } else if (report.distributor_type) {
        filter.distributor_type = new mongoose.Types.ObjectId(
          report.distributor_type
        );
      }

      const distributors = await Distributor.find(filter).populate(
        "distributor_type"
      );

      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({ margin: 15, size: "A3" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="distributor_report.pdf"`
      );

      doc.pipe(res);
      doc
        .fontSize(18)
        .text("Distributor Report", { align: "center" })
        .moveDown(1);

      const headers = [
        "Name",
        "Firm",
        "Email",
        "Mobile",
        "Type",
        "Zone",
        "Address",
        "City",
        "State",
        "Pincode",
      ];
      const columnWidths = [70, 70, 100, 70, 60, 60, 120, 70, 70, 60];
      const rowHeight = 20;

      let startX = doc.x,
        currentY = doc.y;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(8);
        rowData.forEach((text, i) => {
          doc.rect(x, y, columnWidths[i], rowHeight).stroke();
          doc.text(String(text || "-"), x + 2, y + 5, {
            width: columnWidths[i] - 4,
            height: rowHeight,
            ellipsis: true,
          });
          x += columnWidths[i];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      distributors.forEach((d) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage();
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          d.name,
          d.firm_name,
          d.email,
          d.mobile_number,
          d.distributor_type?.name || "-",
          d.region,
          d.address,
          d.city,
          d.state,
          d.pincode,
        ]);
        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("PDF Generation Error:", err.message);
      res.status(500).send("Failed to generate report");
    }
  };
  //#endregion

  //#region User Report
  static reportUser = async (req, res) => {
    try {
      const users = await User.find();

      // Last 7 reports only
      const report = await Report.find({ report_type: "user" })
        .populate("user")
        .sort({ createdAt: -1 })
        .limit(7);

      const today = new Date().toISOString().split("T")[0];
      return res.render("admin/report-user", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports",
        users,
        report,
        today,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateUserReport = async (req, res) => {
    try {
      const { report_type, user, date_range_from, date_range_to } = req.body;

      if (!report_type || !user || !date_range_from || !date_range_to) {
        return res
          .status(400)
          .json({ error: true, message: "Missing required fields" });
      }

      const newReport = await Report.create({
        report_type,
        user,
        date_range_from,
        date_range_to,
      });

      return res.status(200).json({
        success: true,
        message: "User report generated",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Failed to generate report" });
    }
  };

  static downloadUserReport = async (req, res) => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id).populate("user", "name");
      if (!report) return res.status(404).send("Report not found");

      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      // 👇 convert dates to string (same format as in DB)
      const fromDateStr = dateToString(fromDate);
      const toDateStr = dateToString(toDate);

      // 👇 contact_person + date filter
      const leads = await Leads.find({
        contact_person: { $regex: new RegExp(report.user.name, "i") },
        date: { $gte: fromDateStr, $lte: toDateStr },
      });

      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({
        margin: 15,
        size: "A3",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="user_report.pdf"`
      );
      doc.pipe(res);

      doc.fontSize(16).text("User Leads Report", { align: "center" });
      doc.moveDown();

      const headers = [
        "Name",
        "Brand Name",
        "Profile ID",
        "Company Name",
        "Looking for",
        "Mobile",
        "Email",
        "City",
        "Query",
        "Follow-up",
        "Disposition",
        "Remarks",
        "Status",
      ];

      const columnWidths = [
        70, 70, 55, 55, 70, 70, 100, 70, 90, 70, 80, 90, 60,
      ];
      const startX = doc.x;
      let currentY = doc.y;
      const rowHeight = 20;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(6.5);
        rowData.forEach((text, index) => {
          doc.rect(x, y, columnWidths[index], rowHeight).stroke();
          doc.text(String(text), x + 2, y + 5, {
            width: columnWidths[index] - 4,
            height: rowHeight,
            ellipsis: true,
          });
          x += columnWidths[index];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      leads.forEach((d) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage({ layout: "landscape" });
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          d.contact_person || "-",
          d.brand_name || "-",
          d.profile_id || "-",
          d.company_name || "-",
          d.looking_for || "-",
          d.default_phone || "-",
          d.email || "-",
          d.city || "-",
          d.message || "-",
          d.followup_date || "-",
          d.query_status || "-",
          d.remarks || "-",
          d.status || "-",
        ]);
        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("PDF Generation Error:", err.message);
      res.status(500).send("Failed to generate report");
    }
  };

  static viewUserReport = async (req, res) => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id).populate("user", "name");
      if (!report) return res.status(404).send("Report not found");

      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const fromDateStr = dateToString(fromDate);
      const toDateStr = dateToString(toDate);

      const leads = await Leads.find({
        contact_person: { $regex: new RegExp(report.user.name, "i") },
        date: { $gte: fromDateStr, $lte: toDateStr },
      });

      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({
        margin: 15,
        size: "A3",
      });

      // 👇 yaha difference hai (inline view)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=user_report.pdf");

      doc.pipe(res);

      doc.fontSize(16).text("User Leads Report", { align: "center" });
      doc.moveDown();

      const headers = [
        "Name",
        "Brand Name",
        "Profile ID",
        "Company Name",
        "Looking for",
        "Mobile",
        "Email",
        "City",
        "Query",
        "Follow-up",
        "Disposition",
        "Remarks",
        "Status",
      ];

      const columnWidths = [
        70, 70, 55, 55, 70, 70, 100, 70, 90, 70, 80, 90, 60,
      ];
      const startX = doc.x;
      let currentY = doc.y;
      const rowHeight = 20;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(6.5);
        rowData.forEach((text, index) => {
          doc.rect(x, y, columnWidths[index], rowHeight).stroke();
          doc.text(String(text), x + 2, y + 5, {
            width: columnWidths[index] - 4,
            height: rowHeight,
            ellipsis: true,
          });
          x += columnWidths[index];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      leads.forEach((d) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage({ layout: "landscape" });
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          d.contact_person || "-",
          d.brand_name || "-",
          d.profile_id || "-",
          d.company_name || "-",
          d.looking_for || "-",
          d.default_phone || "-",
          d.email || "-",
          d.city || "-",
          d.message || "-",
          d.followup_date || "-",
          d.query_status || "-",
          d.remarks || "-",
          d.status || "-",
        ]);
        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("PDF View Error:", err.message);
      res.status(500).send("Failed to view report");
    }
  };
  //#endregion

  //#region Hrms Report
  static reportHrms = async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const report = await Report.find({
        report_type: {
          $in: [
            "hrms_leave",
            "hrms_attendance",
            "hrms_office_calender",
            "hrms_salary",
            "hrms_resignation",
          ],
        },
      }).populate("user manager");
      const users = await User.find();
      const managerRole = await Role.findOne({ name: "Manager" });
      let managers = [];
      if (managerRole) {
        managers = await User.find({ role: managerRole._id });
      }
      return res.render("admin/report-hrms", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports", // Added pageId parameter
        report,
        today,
        users,
        managers,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateHrmsReport = async (req, res) => {
    try {
      const { report_type, user, manager, date_range_from, date_range_to } =
        req.body;

      if (!report_type || !date_range_from || !date_range_to) {
        return res
          .status(400)
          .json({ error: true, message: "Missing required fields" });
      }

      // Save to Report table
      const newReport = await Report.create({
        report_type,
        user: user || null,
        manager: manager || null,
        date_range_from,
        date_range_to,
      });

      return res.status(200).json({
        success: true,
        message: "HRMS report generated",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Failed to generate report" });
    }
  };

  static downloadHrmsReport = async (req, res) => {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);
      if (!report) return res.status(404).send("Report not found");

      let data = [];
      let headers = [];
      let fileTitle = "";

      // Convert report date_range_from / to to comparable string format
      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      const fromTime = fromDate.getTime();
      const toTime = toDate.getTime();

      // Build user filter if manager/user is selected
      let userFilter = {};
      if (report.manager) {
        const managerRole = await Role.findOne({ name: "Manager" });
        if (managerRole) {
          const managerUsers = await User.find({ role: managerRole._id });
          const managerUserIds = managerUsers.map((u) => u._id);
          userFilter.user_id = { $in: managerUserIds };
        }
      } else if (report.user) {
        userFilter.user_id = report.user;
      }

      switch (report.report_type) {
        case "hrms_salary": {
          // Get all data (since created_at is string)
          const allSalary = await SalarySlip.find({ ...userFilter }).populate(
            "user_id"
          );

          // Manually filter using JS Date conversion
          data = allSalary.filter((item) => {
            const itemTime = new Date(item.created_at).getTime();
            return itemTime >= fromTime && itemTime <= toTime;
          });

          headers = [
            "Name",
            "Month",
            "Year",
            "Payroll Type",
            "Net Salary",
            "Status",
          ];
          fileTitle = "Salary_Report";
          break;
        }

        case "hrms_leave": {
          const allLeave = await Leave.find({ ...userFilter }).populate(
            "user_id"
          );
          data = allLeave.filter((item) => {
            const itemTime = new Date(item.created_at).getTime();
            return itemTime >= fromTime && itemTime <= toTime;
          });

          headers = ["Name", "Leave Type", "From", "To", "Reason", "Status"];
          fileTitle = "Leave_Report";
          break;
        }

        case "hrms_office_calender": {
          const allCalendar = await OfficeCalender.find();
          data = allCalendar.filter((item) => {
            const itemTime = new Date(item.created_at).getTime();
            return itemTime >= fromTime && itemTime <= toTime;
          });

          headers = ["Date", "Event", "End Date"];
          fileTitle = "Office_Calendar_Report";
          break;
        }

        case "hrms_resignation": {
          const allTerminations = await Termination.find({
            ...userFilter,
          }).populate("user_id");
          data = allTerminations.filter((item) => {
            const itemTime = new Date(item.created_at).getTime();
            return itemTime >= fromTime && itemTime <= toTime;
          });

          headers = [
            "Name",
            "Type",
            "Notice Date",
            "Termination Date",
            "Description",
            "Status",
          ];
          fileTitle = "Resignation_Report";
          break;
        }

        default:
          return res.status(400).send("Unsupported report type");
      }

      // --- PDF GENERATION ---
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({ margin: 20, size: "A3" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileTitle}.pdf"`
      );

      doc.pipe(res);
      doc.fontSize(16).text(fileTitle.replace(/_/g, " "), { align: "center" });
      doc.moveDown();

      const rowHeight = 20;
      const startX = doc.x;
      let currentY = doc.y;
      const columnWidths = headers.map(() => 80);

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(8);
        rowData.forEach((text, index) => {
          doc.rect(x, y, columnWidths[index], rowHeight).stroke();
          doc.text(String(text || "-"), x + 2, y + 5, {
            width: columnWidths[index] - 4,
            ellipsis: true,
          });
          x += columnWidths[index];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      data.forEach((item) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage();
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        let row = [];
        switch (report.report_type) {
          case "hrms_salary":
            row = [
              item.user_id?.name || "-",
              item.month || "-",
              item.year || "-",
              item.payroll_type || "-",
              item.net_salary || "-",
              item.status || "-",
            ];
            break;

          case "hrms_leave":
            row = [
              item.user_id?.name || "-",
              item.leave_type || "-",
              item.start_date || "-",
              item.end_date || "-",
              item.reason || "-",
              item.status || "-",
            ];
            break;

          case "hrms_resignation":
            row = [
              item.user_id?.name || "-",
              item.type || "-",
              item.notice_date || "-",
              item.termination_date || "-",
              item.description || "-",
              item.status || "-",
            ];
            break;

          case "hrms_office_calender":
            row = [item.date || "-", item.event || "-", item.end_date || "-"];
            break;
        }

        drawRow(currentY, row);
        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("PDF Generation Error:", err.message);
      res.status(500).send("Failed to generate report");
    }
  };
  //#endregion

  //#region Inventory Report
  static reportInventory = async (req, res) => {
    try {
      const report = await Report.find({ report_type: "inventory" }).populate(
        "inventory_type"
      );
      const distributors = await Distributor.find();
      const dealerRole = await Role.findOne({ name: "Dealers" });

      let dealers = [];
      if (dealerRole) {
        dealers = await User.find({ role: dealerRole._id });
      }

      const categories = await Category.find();

      const today = new Date().toISOString().split("T")[0];

      return res.render("admin/report-inventory", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports",
        report,
        distributors,
        dealers,
        today,
        categories,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateInventoryReport = async (req, res) => {
    try {
      const {
        report_type,
        date_range_from,
        date_range_to,
        type,
        inventory_type,
      } = req.body;

      if (!report_type || !date_range_from || !date_range_to) {
        return res
          .status(400)
          .json({ error: true, message: "Missing required fields" });
      }

      const safeInventoryType =
        inventory_type && inventory_type !== "" ? inventory_type : null;
      const safeType = type && type !== "" ? type : null;

      // Save report with filters
      const newReport = await Report.create({
        report_type,
        date_range_from,
        date_range_to,
        type: safeType,
        inventory_type: safeInventoryType,
      });

      return res.status(200).json({
        success: true,
        message: "Inventory report generated",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Failed to generate report" });
    }
  };

  static downloadInventoryReport = async (req, res) => {
    try {
      const { id } = req.params;

      const report = await Report.findById(id);
      if (!report) return res.status(404).send("Report not found");

      // Parse date range
      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);

      const startOfDay = new Date(fromDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Build filter object
      let filter = {
        created_at: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      };

      // Apply type filter
      if (report.type === "distributor_wise") {
        filter.distributor_price = { $gt: 0 };
      } else if (report.type === "dealer_wise") {
        filter.dealer_price = { $gt: 0 };
      }

      // Apply inventory_type/category filter
      if (report.inventory_type) {
        filter.category_id = report.inventory_type;
      }

      // Fetch products with filter
      const products = await Product.find(filter).populate("category_id");

      if (!products.length) {
        return res.status(404).send("No products found for this report");
      }

      // Setup PDF
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({ margin: 15, size: "A3" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="inventory_report.pdf"`
      );

      doc.pipe(res);

      doc.fontSize(18).text("Inventory Report", { align: "center" });
      doc.moveDown(1);

      const headers = [
        "Door Name",
        "Door Code",
        "Size",
        "Sku",
        "Thickness",
        "Pannel Thickness",
        "Brand",
        "Quantity",
        "MRP",
        "Distributor Price",
        "Dealer Price",
        "Sale Price",
        "Category",
      ];

      const columnWidths = [55, 70, 40, 50, 40, 50, 60, 45, 35, 50, 50, 50, 70];
      const startX = doc.x;
      let currentY = doc.y;
      const rowHeight = 20;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(7);
        rowData.forEach((text, index) => {
          doc.rect(x, y, columnWidths[index], rowHeight).stroke();
          doc.text(String(text ?? "-"), x + 2, y + 5, {
            width: columnWidths[index] - 4,
            height: rowHeight,
            ellipsis: true,
          });
          x += columnWidths[index];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      products.forEach((p) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage();
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          p.door_name || "-",
          p.door_code || "-",
          Array.isArray(p.size) ? p.size.join(", ") : p.size || "-",
          p.sku || "-",
          p.thickness || "-",
          p.pannel_thickness || "-",
          p.brand_name || "-",
          p.quantity ?? "-",
          p.mrp ?? "-",
          p.distributor_price ?? "-",
          p.dealer_price ?? "-",
          p.sale_price ?? "-",
          p.category_id ? p.category_id.name : "-",
        ]);
        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("PDF Generation Error:", err.message);
      res.status(500).send("Failed to generate report");
    }
  };
  //#endregion

  //#region Accounts Report
  static reportAccounts = async (req, res) => {
    try {
      const { report_type, date_range_from, date_range_to } = req.query;

      let filter = {
        report_type: {
          $in: ["accounts_purchase", "accounts_sales", "accounts_estimation"],
        },
      };

      if (report_type) filter.report_type = report_type;
      if (date_range_from && date_range_to) {
        filter.date_range_from = { $gte: date_range_from };
        filter.date_range_to = { $lte: date_range_to };
      }

      const report = await Report.find(filter).sort({ createdAt: -1 });

      const today = new Date().toISOString().slice(0, 10); // default today for inputs

      return res.render("admin/report-accounts", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "reports",
        report,
        today,
        query: { report_type, date_range_from, date_range_to },
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateAccountsReport = async (req, res) => {
    try {
      const { report_type, date_range_from, date_range_to } = req.body;

      if (!report_type || !date_range_from || !date_range_to) {
        return res
          .status(400)
          .json({ error: true, message: "Missing required fields" });
      }

      const newReport = await Report.create({
        report_type,
        date_range_from,
        date_range_to,
      });

      return res.status(200).json({
        success: true,
        message: "Accounts report generated",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Failed to generate report" });
    }
  };

  static downloadAccountsReport = async (req, res) => {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);
      if (!report) return res.status(404).send("Report not found");

      const fromDate = new Date(report.date_range_from);
      const toDate = new Date(report.date_range_to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const doc = new PDFDocument({ margin: 20, size: "A3" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="accounts_report.pdf"`
      );
      doc.pipe(res);

      doc.fontSize(16).text("Accounts Report", { align: "center" });
      doc.moveDown();

      let data = [];
      const headers = [
        "Customer",
        "Invoice Date",
        "Invoice No",
        "Amount",
        "Status",
      ];

      // Fetch data based on report type
      switch (report.report_type) {
        case "accounts_purchase":
          data = await PurchaseInvoice.find({
            invoice_date: { $gte: fromDate, $lte: toDate },
          });
          break;
        case "accounts_sales":
          data = await SalesInvoice.find({
            invoice_date: { $gte: fromDate, $lte: toDate },
          });
          break;
        case "accounts_estimation":
          data = await EstimationInvoice.find({
            invoice_date: { $gte: fromDate, $lte: toDate },
          });
          break;
        default:
          return res.status(400).send("Invalid report type.");
      }

      // Table setup
      const rowHeight = 20;
      const columnWidths = headers.map(() => 100);
      const startX = doc.x;
      let currentY = doc.y;

      const drawRow = (y, rowData, isHeader = false) => {
        let x = startX;
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(8);
        rowData.forEach((text, index) => {
          doc.rect(x, y, columnWidths[index], rowHeight).stroke();
          doc.text(String(text), x + 2, y + 5, {
            width: columnWidths[index] - 4,
            ellipsis: true,
          });
          x += columnWidths[index];
        });
      };

      drawRow(currentY, headers, true);
      currentY += rowHeight;

      data.forEach((item) => {
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage();
          currentY = doc.y;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          item.customer_name || "-",
          item.invoice_date
            ? new Date(item.invoice_date).toLocaleDateString("en-IN")
            : "-",
          item.invoice_number || "-",
          item.total?.toFixed(2) || "0.00",
          item.status || "-",
        ]);

        currentY += rowHeight;
      });

      doc.end();
    } catch (err) {
      console.error("Report PDF Error:", err.message);
      res.status(500).send("Failed to generate report");
    }
  };
  //#endregion
}

module.exports = ReportController;
