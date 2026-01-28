const Adminauth = require("../../models/Adminauth");
const Distributor = require("../../models/Distributor");
const Role = require("../../models/Role");
const Status = require("../../models/Status");
const bcrypt = require("bcrypt");
const config = require("../../config/createStatus");

class DistributorController {
  static distributors = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const distributors = await Distributor.find().lean();
      //total distributors
      const totalDistributors = await Distributor.countDocuments({});

      // active distributors
      const activeStatusId = await Status.findOne({
        type: "distributor",
        name: { $regex: new RegExp("^active$", "i") },
      });
      const activeDistributors = await Distributor.countDocuments({
        status: activeStatusId,
      });

      return res.render("admin/distributor", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "distributor", // Added pageId parameter
        distributors,
        totalDistributors,
        activeDistributors,
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static manageDistributors = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;

      const admin = await Adminauth.findOne({ email: req.session.email });
      const { region, status: statusId } = req.query;

      const query = {};
      if (region) query.region = region;
      if (statusId) query.status = statusId;

      const totalItems = await Distributor.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

      const distributors = await Distributor.find(query)
        .populate("status distributor_type")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const status = await Status.find({ type: "distributor" }).lean();
      const role = await Role.find({
        name: { $in: ["Dealers", "Franchises"] },
      }).lean();

      return res.render("admin/distributor-management", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "distributor", // Added pageId parameter
        distributors,
        status,
        role,
        selectedRegion: region || "",
        selectedStatus: statusId || "",
        selectedDistributorType: "",
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

  static createDistributor = async (req, res) => {
    try {
      const name = req.body.name;
      const firm_name = req.body.firm_name;
      let email = req.body.email;
      const distributor_type = req.body.distributor_type;
      const mobile_number = req.body.mobile_number;
      const address = req.body.address;
      const state = req.body.state;
      const city = req.body.city;
      const pincode = req.body.pincode;
      const region = req.body.region;
      const status = req.body.status;
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;

      // Convert email to lowercase
      email = email.toLowerCase();

      // validation phone required
      if (!mobile_number) {
        return res.send({
          message: "Mobile no. is required",
        });
      }

      // phone validation RegEx
      const phonePattern = new RegExp("^[0-9]{10}$");
      if (!phonePattern.test(mobile_number)) {
        return res.status(500).send({
          message: "Invalid mobile number",
        });
      }

      // Unique phone number validation
      const phoneExists = await Distributor.findOne({
        mobile_number: mobile_number,
      });
      if (phoneExists) {
        return res.status(500).send({
          message: "Mobile number already registered",
        });
      }

      // email validation RegEx
      var emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
      if (!emailRegex.test(email)) {
        return res.status(500).send({
          message: "Invalid email address",
        });
      }

      if (password !== confirm_password)
        return res.send({
          message: "Password and Confirm Password do not match",
        });

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedpassword = await bcrypt.hash(password, salt);
      const hashedconfirm_password = await bcrypt.hash(confirm_password, salt);

      const distributorExists = await Distributor.findOne({
        email: email,
      });
      if (distributorExists) {
        return res.send({
          message: "Distributor already exists",
        });
      }

      await config.createDistributorStatus();
      const activeStatus = await Status.findOne({
        type: "distributor",
        name: { $regex: new RegExp("^active$", "i") },
      });

      const distributor = await Distributor({
        name: name,
        firm_name: firm_name,
        email: email,
        distributor_type: distributor_type,
        mobile_number: mobile_number,
        address: address,
        state: state,
        city: city,
        pincode: pincode,
        region: region,
        password: hashedpassword,
        confirm_password: hashedconfirm_password,
        status: status ? status : activeStatus._id,
      });
      await distributor.save();

      return res.send({
        status: 200,
        message: "Distributor Add successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static updateDistributor = async (req, res) => {
    try {
      const distributor = await Distributor.findOne({ _id: req.body.editid });
      if (!distributor) {
        return res.status(404).send({ message: "Distributor not found" });
      }

      let updatedData = {
        name: req.body.edit_name,
        firm_name: req.body.edit_firm_name,
        email: req.body.edit_email.toLowerCase(),
        distributor_type: req.body.edit_distributor_type,
        mobile_number: req.body.edit_mobile_number,
        address: req.body.edit_address,
        state: req.body.edit_state,
        city: req.body.edit_city,
        pincode: req.body.edit_pincode,
        region: req.body.edit_region,
        updated_at: new Date(),
      };

      await Distributor.findOneAndUpdate(
        { _id: req.body.editid },
        updatedData,
        {
          new: true,
        }
      );
      return res.status(200).send({
        status: 200,
        message: "Distributor Update Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static deleteDistributor = async (req, res) => {
    try {
      await Distributor.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Distributor Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Distributor Deletion Failed.", error: true });
    }
  };

  static deleteDistributors = async (req, res) => {
    try {
      await Distributor.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Distributor Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Distributor Deletion Failed.", error: true });
    }
  };
}

module.exports = DistributorController;
