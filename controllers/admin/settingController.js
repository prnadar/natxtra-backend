const Adminauth = require("../../models/Adminauth");
const SmtpConfig = require("../../models/SmtpConfig");
const WebSetting = require("../../models/WebSetting");
const RazorpayConfig = require("../../models/RazorpayConfig");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const fs = require("fs");
const imageFilter = require("../../config/imageFilter");

class SettingController {
  static generalSettings = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({
        email: req.session.email,
      });
      const settings = await WebSetting.findOne();
      return res.render("admin/general-settings", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "settings", // Added pageId parameter
        company_name: settings ? settings.company_name : "",
        logo: settings ? settings.logo : "",
        mobile: settings ? settings.mobile : "",
        email: settings ? settings.email : "",
        address: settings ? settings.address : "",
        city: settings ? settings.city : "",
        state: settings ? settings.state : "",
        zip: settings ? settings.zip : "",
        toll_number: settings ? settings.toll_number : "",
        copyright: settings ? settings.copyright : "",
        gst_registration_no: settings ? settings.gst_registration_no : "",
        twitter: settings ? settings.twitter : "",
        facebook: settings ? settings.facebook : "",
        instagram: settings ? settings.instagram : "",
        footer_text: settings ? settings.footer_text : "",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static generalSettingsAdd = async (req, res) => {
    try {
      logoUpload(req, res, async function (err) {
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
        let exist = await WebSetting.findOne();

        const insertData = {
          company_name: data.company_name,
          logo: req.file ? req.file.filename : exist ? exist.logo : "",
          mobile: data.mobile,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          toll_number: data.toll_number,
          copyright: data.copyright,
          gst_registration_no: data.gst_registration_no,
          twitter: data.twitter,
          facebook: data.facebook,
          instagram: data.instagram,
          footer_text: data.footer_text,
        };

        if (exist) {
          if (req.file && exist.logo) {
            fs.unlink(
              path.join(root, "/public/uploads/websetting/", exist.logo),
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          }
          insertData.updated_at = new Date();
          await WebSetting.updateOne({}, insertData);
        } else {
          const newSetting = new WebSetting(insertData);
          await newSetting.save();
        }

        return res.send({
          status: 200,
          message: "Settings updated successfully",
        });
      });
    } catch (error) {
      console.error(error);
      return res.send({
        status: 500,
        message: "Failed to Settings update: " + error.message,
      });
    }
  };

  static settingEmail = async (req, res) => {
    try {
      const admin = await Adminauth.findOne({ email: req.session.email });
      const smtpConfig = await SmtpConfig.findOne();
      return res.render("admin/setting-email", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "settings", // Added pageId parameter
        service: smtpConfig ? smtpConfig.service : "",
        host: smtpConfig ? smtpConfig.host : "",
        port: smtpConfig ? smtpConfig.port : "",
        mail_address: smtpConfig ? smtpConfig.mail_address : "",
        name: smtpConfig ? smtpConfig.name : "",
        username: smtpConfig ? smtpConfig.username : "",
        password: smtpConfig ? smtpConfig.password : "",
        secure: smtpConfig ? (smtpConfig.secure === true ? "tsl" : "ssl") : "",
      });
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static smtp_config_add = async (req, res) => {
    try {
      const data = req.body;
      let exist = await SmtpConfig.findOne();

      const insertData = {
        // service: data.service,
        host: data.host,
        port: data.port,
        mail_address: data.mail_address,
        name: data.name,
        username: data.username,
        password: data.password,
        secure: data.secure === "tsl" ? true : false,
      };

      if (exist) {
        insertData.updated_at = new Date();
        await SmtpConfig.updateOne({}, insertData);
      } else {
        const newConfig = new SmtpConfig(insertData);
        await newConfig.save();
      }

      return res.send({
        status: 200,
        message: "SMTP Config updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.send({
        status: 500,
        message: "Failed to update SMTP Config: " + error.message,
      });
    }
  };

  static razorpay_config = async (req, res) => {
    try {
      const razorpayconfig = await RazorpayConfig.findOne();

      return res.render("admin/razorpay-config", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        pageId: "settings", // Added pageId parameter
        key_id: razorpayconfig ? razorpayconfig.key_id : "",
        key_secret: razorpayconfig ? razorpayconfig.key_secret : "",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error razorpay_config: " + error.message);
    }
  };

  static razorpay_config_add = async (req, res) => {
    try {
      const data = req.body;
      let exist = await RazorpayConfig.findOne();

      const insertData = {
        key_id: data.key_id,
        key_secret: data.key_secret,
      };

      if (exist) {
        insertData.updated_at = new Date();
        await RazorpayConfig.updateOne({}, insertData);
      } else {
        const newSetting = new RazorpayConfig(insertData);
        await newSetting.save();
      }

      return res.send({
        status: 200,
        message: "Razorpay config updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.send({
        status: 500,
        message: "Failed to Razorpay config update: " + error.message,
      });
    }
  };
}

const logoStorage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/websetting"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const logoUpload = multer({
  storage: logoStorage,
  fileFilter: imageFilter,
}).single("logo");

module.exports = SettingController;
