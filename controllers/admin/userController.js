const Adminauth = require("../../models/Adminauth");
const Role = require("../../models/Role");
const Permission = require("../../models/Permission");
const User = require("../../models/User");
const Status = require("../../models/Status");
const bcrypt = require("bcrypt");
const config = require("../../config/createStatus");
const Designation = require("../../models/Designation");

class UserController {
  static userManagement = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const { role, status: statusId } = req.query;

      const query = {};
      if (role) query.role = role;
      if (statusId) query.status = statusId;

      const roles = await Role.find().populate("permissions").lean();
      const designations = await Designation.find().lean();
      const status = await Status.find({ type: "user" }).lean();

      const totalItems = await User.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

      const users = await User.find(query)
        .populate("role")
        .populate("designation")
        .populate("reporting_to")
        .populate("status")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.render("admin/user-management", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "user", // Added pageId parameter
        roles,
        designations,
        users,
        status,
        selectedRole: role || "",
        selectedStatus: statusId || "",
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

  static createUser = async (req, res) => {
    try {
      let {
        name,
        email,
        role,
        designation,
        reporting_to,
        mobile_number,
        address,
        state,
        city,
        pincode,
        status,
        password,
        confirm_password,
      } = req.body;

      // Convert email to lowercase
      email = email?.toLowerCase();

      // 🔹 Fix: handle empty reporting_to
      if (!reporting_to || reporting_to === "") {
        reporting_to = null;
      }

      // Validation
      if (!mobile_number) {
        return res.send({ message: "Mobile no. is required" });
      }

      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(mobile_number)) {
        return res.status(400).send({ message: "Invalid mobile number" });
      }

      const phoneExists = await User.findOne({ mobile_number });
      if (phoneExists) {
        return res
          .status(400)
          .send({ message: "Mobile number already registered" });
      }

      const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send({ message: "Invalid email address" });
      }

      if (password !== confirm_password) {
        return res.send({
          message: "Password and Confirm Password do not match",
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedpassword = await bcrypt.hash(password, salt);
      const hashedconfirm_password = await bcrypt.hash(confirm_password, salt);

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.send({ message: "User already exists" });
      }

      await config.createUserStatus();
      const activeStatus = await Status.findOne({
        type: "user",
        name: { $regex: new RegExp("^active$", "i") },
      });

      // 🔹 Auto-generate employee_id
      const lastUser = await User.findOne().sort({ createdAt: -1 }).lean();
      let nextNumber = 1;
      if (lastUser && lastUser.employee_id) {
        const lastNumber = parseInt(lastUser.employee_id.replace("ETSPL", ""));
        nextNumber = lastNumber + 1;
      }
      const employee_id = "ETSPL" + String(nextNumber).padStart(2, "0");

      // ✅ Safe creation (reporting_to can be null)
      const user = new User({
        employee_id,
        name,
        email,
        role,
        designation,
        reporting_to,
        mobile_number,
        address,
        state,
        city,
        pincode,
        password: hashedpassword,
        confirm_password: hashedconfirm_password,
        status: status ? status : activeStatus?._id || null,
      });

      await user.save();

      return res.send({
        status: 200,
        message: "User added successfully",
        employee_id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong, please try again later",
        error: error.message,
      });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.editid });
      if (!user) {
        return res.status(404).send({ message: "user not found" });
      }

      let updatedData = {
        name: req.body.edit_name,
        email: req.body.edit_email.toLowerCase(),
        role: req.body.edit_role,
        designation: req.body.edit_designation,
        reporting_to: req.body.edit_reporting_to,
        mobile_number: req.body.edit_mobile_number,
        address: req.body.edit_address,
        state: req.body.edit_state,
        city: req.body.edit_city,
        pincode: req.body.edit_pincode,
        updated_at: new Date(),
      };

      await User.findOneAndUpdate({ _id: req.body.editid }, updatedData, {
        new: true,
      });
      return res.status(200).send({
        status: 200,
        message: "User Update Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "User Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "User Deletion Failed.", error: true });
    }
  };

  static deleteUsers = async (req, res) => {
    try {
      await User.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "User Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "User Deletion Failed.", error: true });
    }
  };

  static createRole = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await Role.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      // Get paginated roles with permissions
      const roles = await Role.find()
        .populate("permissions")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      // Define modules
      const modules = [
        "Dashboard",
        "Order",
        "Sales",
        "Distributor",
        "User",
        "HR",
        "Inventory",
        "Accounts",
        "Support Tickets",
        "Reports",
        "Setting",
        "Web Management",
      ];

      return res.render("admin/create-new-role", {
        admin: req.user,
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "user",
        roles,
        modules,
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

  static createNewRole = async (req, res) => {
    try {
      const { name, modules } = req.body;

      const permissionIds = await Promise.all(
        modules.map(async (mod) => {
          const newPermission = new Permission({
            module: mod.module,
            permissions: {
              manage: mod.permissions.manage,
              create: mod.permissions.create,
              edit: mod.permissions.edit,
              delete: mod.permissions.delete,
            },
          });
          const saved = await newPermission.save();
          return saved._id;
        })
      );

      const newRole = new Role({
        name,
        permissions: permissionIds,
      });

      await newRole.save();

      return res.json({ success: true, message: "Role created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

  static updateRole = async (req, res) => {
    try {
      const { id, name, permissions } = req.body;

      const parsed =
        typeof permissions === "string" ? JSON.parse(permissions) : permissions;
      const parsedModules = {};

      parsed.forEach((val) => {
        const module = val.module;
        const perms = val.permissions;

        parsedModules[module] = {
          module,
          permissions: {
            manage: perms.manage || false,
            create: perms.create || false,
            edit: perms.edit || false,
            delete: perms.delete || false,
          },
        };
      });

      const modules = Object.values(parsedModules);

      // Delete old permissions
      const oldRole = await Role.findById(id);
      await Permission.deleteMany({ _id: { $in: oldRole.permissions } });

      // Save new permissions
      const permissionIds = await Promise.all(
        modules.map(async (mod) => {
          const newPerm = new Permission({
            module: mod.module,
            permissions: mod.permissions,
          });
          const saved = await newPerm.save();
          return saved._id;
        })
      );

      // Update role
      await Role.findByIdAndUpdate(id, {
        name,
        permissions: permissionIds,
      });

      return res.json({ success: true, message: "Role updated successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  };

  static deleteRole = async (req, res) => {
    try {
      await Role.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Role Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Role Deletion Failed.", error: true });
    }
  };

  static deleteRoles = async (req, res) => {
    try {
      await Role.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Role Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Role Deletion Failed.", error: true });
    }
  };

  static createDesignation = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const totalItems = await Designation.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);
      const designations = await Designation.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();
      return res.render("admin/create-new-designation", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "user", // Added pageId parameter
        designations,
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

  static createNewDesignation = async (req, res) => {
    try {
      const { name } = req.body;

      const newDesignation = new Designation({
        name,
      });
      await newDesignation.save();

      return res.json({
        success: true,
        message: "Designation created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

  static updateDesignation = async (req, res) => {
    try {
      const { editid, edit_name } = req.body;

      const designation = await Designation.findOne({
        _id: editid,
      });
      await Designation.findOneAndUpdate(
        {
          _id: editid,
        },
        {
          name: edit_name,
          updated_at: new Date(),
        }
      );
      return res.send({
        status: 200,
        message: "Designation updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error update Designations: " + error.message,
      });
    }
  };

  static deleteDesignation = async (req, res) => {
    try {
      await Designation.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Designation Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Designation Deletion Failed.", error: true });
    }
  };

  static deleteDesignations = async (req, res) => {
    try {
      await Designation.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Designation Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Designation Deletion Failed.", error: true });
    }
  };
}

module.exports = UserController;
