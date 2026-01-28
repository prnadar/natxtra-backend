const User = require("../../models/User");
const Leave = require("../../models/Leave");
const Termination = require("../../models/Termination");
const OfficeCalender = require("../../models/OfficeCalender");
const SalarySlip = require("../../models/SalarySlip");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const sendEmail = require("../../config/mailer");
const { formDateToDateString } = require("../../utils/dateHelper");

class HRMSController {
  static dashboard = async (req, res) => {
    try {
      // const admin = await Adminauth.findOne({ email: req.session.email });
      return res.render("admin/HRMS-Dash", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static attendenceSystem = async (req, res) => {
    try {
      // const admin = await Adminauth.findOne({ email: req.session.email });
       const today = new Date().toISOString().split("T")[0];
       const users = await User.find();
      return res.render("admin/attendance-system", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
        today,
        users,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  //#region Leave Management
  static leaveManagement = async (req, res) => {
    try {
      const users = await User.find({});
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await Leave.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const leave = await Leave.find({})
        .populate("user_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.render("admin/leave-management", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
        users,
        leave,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static addLeave = async (req, res) => {
    try {
      req.body.start_date = formDateToDateString(req.body.start_date);
      req.body.end_date = formDateToDateString(req.body.end_date);
      const insertRecord = new Leave({
        type: req.body.type,
        user_id: req.body.user_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        reason: req.body.reason,
        remarks: req.body.remarks,
        status: req.body.status,
        created_at: new Date(),
      });
      await insertRecord.save();
      return res.send({
        status: 200,
        message: "Leave added successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error add Leave: " + error.message,
      });
    }
  };

  static editLeave = async (req, res) => {
    try {
      let {
        editid,
        edit_type,
        edit_user_id,
        edit_start_date,
        edit_end_date,
        edit_reason,
        edit_remarks,
      } = req.body;

      edit_start_date = formDateToDateString(edit_start_date);
      edit_end_date = formDateToDateString(edit_end_date);

      const leave = await Leave.findOne({
        _id: editid,
      });
      await Leave.findOneAndUpdate(
        {
          _id: editid,
        },
        {
          type: edit_type,
          user_id: edit_user_id,
          start_date: edit_start_date,
          end_date: edit_end_date,
          reason: edit_reason,
          remarks: edit_remarks,
          updated_at: new Date(),
        }
      );
      return res.send({
        status: 200,
        message: "Leave updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error update Leave: " + error.message,
      });
    }
  };

  static updateLeaveStatus = async (req, res) => {
    try {
      const { leaveId, status } = req.body;

      // Update the status in the database
      const updatedData = await Leave.findByIdAndUpdate(
        leaveId,
        { status: status },
        { new: true }
      );

      if (updatedData) {
        res.send({
          message: "Leave status updated successfully.",
        });
      } else {
        res.send({
          message: "Failed to update leave status.",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error update leave status: " + error.message });
    }
  };

  static deleteLeave = async (req, res) => {
    try {
      await Leave.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Leave Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Leave Deletion Failed.", error: true });
    }
  };

  static deleteLeaves = async (req, res) => {
    try {
      await Leave.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Leave Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Leave Deletion Failed.", error: true });
    }
  };
  //#endregion Leave Management

  // #region office calender
  static officeCalender = async (req, res) => {
    try {
      return res.render("admin/office-calander", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static getAllEvents = async (req, res) => {
    try {
      const events = await OfficeCalender.find({});
      const formatted = events.map((e) => ({
        _id: e._id,
        title: e.event,
        start: e.date,
        end: e.end_date || e.date,
        color: e.color || "#3788d8",
      }));
      res.json(formatted); // return JSON!
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  };

  static saveEvent = async (req, res) => {
    try {
      const { title, start, end } = req.body;

      req.body.start = formDateToDateString(req.body.start);
      req.body.end = formDateToDateString(req.body.end);

      const newEvent = new OfficeCalender({
        event: title,
        date: start,
        end_date: end,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const saved = await newEvent.save();

      return res.status(200).json({
        status: 200,
        message: "Event saved successfully",
        event: saved,
      });
    } catch (error) {
      console.error("Error saving event:", error.message);
      return res.status(500).json({
        status: 500,
        message: "Error saving event",
      });
    }
  };

  static updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const updated = await OfficeCalender.findByIdAndUpdate(
        id,
        { event: title, updated_at: new Date() },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: "Event not found" });

      res.status(200).json(updated);
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  };

  static deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await OfficeCalender.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ error: "Event not found" });

      res.status(200).json({ message: "Event deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  };

  // #endregion office calender

  // #region Salary Slip Management
  static salarySlipManage = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await SalarySlip.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const salarySlips = await SalarySlip.find({})
        .populate("user_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.render("admin/salary-slip-manage", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
        salarySlips,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static generateSalarySlip = async (req, res) => {
    try {
      const { month, year } = req.body;

      if (!month || !year) {
        return res
          .status(400)
          .json({ message: "Month and Year are required." });
      }

      const users = await User.find();
      const slips = [];

      for (let user of users) {
        const existing = await SalarySlip.findOne({
          user_id: user._id,
          month,
          year,
        });

        if (!existing) {
          const salary = user.salary || 0;
          const net_salary = salary;

          const slip = new SalarySlip({
            user_id: user._id,
            month,
            year,
            payroll_type: "Monthly",
            salary,
            net_salary,
            status: "Unpaid",
          });

          await slip.save();
          slips.push({
            user_id: user._id,
            month,
            year,
          });
        }
      }

      return res.status(200).json({
        message: "Salary slips generated successfully.",
        slips,
      });
    } catch (error) {
      console.error("Generate Payslip Error:", error.message);
      return res.status(500).json({
        message: "Error generating salary slips.",
        error: error.message,
      });
    }
  };

  static downloadSalarySlipPDF = async (req, res) => {
    try {
      const { userId, month, year } = req.query;

      const slip = await SalarySlip.findOne({
        user_id: userId,
        month,
        year,
      }).populate({
        path: "user_id",
        populate: { path: "designation" },
      });
      const user = slip?.user_id;

      if (!slip || !user) return res.status(404).send("Payslip not found.");

      const templatePath = path.join(
        __dirname,
        "../../views/mail-templates/payslip-template.ejs"
      );
      const html = await ejs.renderFile(templatePath, { slip, user });

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "domcontentloaded" });
      await page.emulateMediaType("screen");

      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      const uploadsDir = path.join(__dirname, "../../public/uploads/payslip");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `payslip-${user.name.replace(
        /\s+/g,
        "_"
      )}-${month}-${year}.pdf`;
      const savePath = path.join(uploadsDir, filename);

      fs.writeFileSync(savePath, pdfBuffer);

      // Step: Send the PDF via email
      const subject = `Your Payslip for ${month} ${year}`;
      const body = { email: user.email };

      const HTML_TEMPLATE = await ejs.renderFile(
        path.join(__dirname, "../../views/mail-templates/payslip-template.ejs"),
        { user, month, year, slip }
      );

      // Send email
      await sendEmail(subject, body, HTML_TEMPLATE);

      return res.status(200).json({
        message: "Payslip saved and emailed successfully.",
        file: `/uploads/payslip/${filename}`,
      });
    } catch (err) {
      console.error("Error generating or sending payslip:", err.message);
      res.status(500).send("Error generating or emailing payslip PDF.");
    }
  };

  //#endregion Salary Slip Management

  //#region Termination
  static resignTermination = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await Termination.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const termination = await Termination.find({})
        .populate("user_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const users = await User.find({});
      return res.render("admin/resign-termination", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "hrms", // Added pageId parameter
        termination,
        users,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong. Please try again later.");
    }
  };

  static addTermination = async (req, res) => {
    try {
      req.body.notice_date = formDateToDateString(req.body.notice_date);
      req.body.termination_date = formDateToDateString(
        req.body.termination_date
      );

      const insertRecord = new Termination({
        user_id: req.body.user_id,
        type: req.body.type,
        notice_date: req.body.notice_date,
        termination_date: req.body.termination_date,
        description: req.body.description,
        status: req.body.status,
        created_at: new Date(),
      });

      await insertRecord.save();

      // Fetch user details
      const user = await User.findById(req.body.user_id);
      if (!user || !user.email) {
        return res.status(400).send({ message: "User email not found." });
      }

      // Email details
      const subject = "Termination Notice";
      const html = `<p>Dear ${user.name},</p>
        <p>This is to inform you that your termination has been processed.</p>
        <p><strong>Type:</strong> ${req.body.type}</p>
        <p><strong>Notice Date:</strong> ${req.body.notice_date}</p>
        <p><strong>Termination Date:</strong> ${req.body.termination_date}</p>
        <p><strong>Description:</strong> ${req.body.description}</p>
        <p>Regards,<br/>HR Department</p>`;

      // Send email
      const emailSent = await sendEmail(subject, { email: user.email }, html);

      return res.send({
        status: 200,
        message:
          "Termination added successfully" +
          (emailSent ? " and email sent." : " but email failed."),
      });
    } catch (error) {
      console.error("Error in addTermination:", error);
      return res.status(500).send({
        message: "Error add Termination: " + error.message,
      });
    }
  };

  static editTermination = async (req, res) => {
    try {
      let {
        editid,
        edit_user_id,
        edit_type,
        edit_notice_date,
        edit_termination_date,
        edit_description,
      } = req.body;

      edit_notice_date = formDateToDateString(edit_notice_date);
      edit_termination_date = formDateToDateString(edit_termination_date);

      const termination = await Termination.findOne({
        _id: editid,
      });
      await Termination.findOneAndUpdate(
        {
          _id: editid,
        },
        {
          user_id: edit_user_id,
          type: edit_type,
          notice_date: edit_notice_date,
          termination_date: edit_termination_date,
          description: edit_description,
          status: "pending",
          updated_at: new Date(),
        }
      );
      return res.send({
        status: 200,
        message: "Termination updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error update Termination: " + error.message,
      });
    }
  };

  static updateTerminationStatus = async (req, res) => {
    try {
      const { terminationId, status } = req.body;

      // Update the status in the database
      const updatedData = await Termination.findByIdAndUpdate(
        terminationId,
        { status: status },
        { new: true }
      );

      if (updatedData) {
        res.send({
          message: "Termination Status Updated Successfully.",
        });
      } else {
        res.send({
          message: "Failed to update Termination status.",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Error update Termination status: " + error.message });
    }
  };

  static deleteTermination = async (req, res) => {
    try {
      await Termination.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Termination Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Termination Deletion Failed.", error: true });
    }
  };

  static deleteTerminations = async (req, res) => {
    try {
      await Termination.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Termination Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Termination Deletion Failed.", error: true });
    }
  };
  //#endregion Termination
}

module.exports = HRMSController;
