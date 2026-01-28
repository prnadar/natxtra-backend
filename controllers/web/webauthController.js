const WebUser = require("../../models/WebUser");
const WebSetting = require("../../models/WebSetting");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
require("dotenv").config();
const baseURL = process.env.BaseURL;
const fs = require("fs");
const CryptoJS = require("crypto-js");
const sendEmail = require("../../config/mailer");
const ejs = require("ejs");
const imageFilter = require("../../config/imageFilter");

class webauthController {
  static register = async (req, res) => {
    try {
      const name = req.body.name;
      let email = req.body.email;
      const phone = req.body.phone;
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;

      if (!email) {
        return res.status(400).send({
          message: "Email is required",
        });
      }

      // Convert email to lowercase
      email = email.toLowerCase();

      // validation phone required
      if (!phone) {
        return res.status(400).send({
          message: "Phone no. is required",
        });
      }

      // phone validation RegEx
      const phonePattern = new RegExp("^[0-9]{10}$");
      if (!phonePattern.test(phone)) {
        return res.status(400).send({
          message: "Invalid phone number",
        });
      }

      // email validation RegEx
      var emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
      if (!emailRegex.test(email)) {
        return res.status(400).send({
          message: "Invalid email address",
        });
      }

      //   // Password validation RegEx
      //   const passwordPattern =
      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[\W_]).{8,20}$/;

      //   if (!passwordPattern.test(password)) {
      //     return res.status(400).send({
      //       message:
      //         "Password must contain 1 uppercase, 1 lowercase, 2 digits, 1 special character, and be 8-20 characters long.",
      //     });
      //   }

      if (password !== confirm_password) {
        return res.status(400).send({
          message: "Password and Confirm Password do not match",
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedpassword = await bcrypt.hash(password, salt);
      const hashedconfirm_password = await bcrypt.hash(confirm_password, salt);

      const userExists = await WebUser.findOne({
        email: email,
      });

      if (userExists) {
        return res.status(400).send({
          message: "User already exists",
        });
      }

      const webuser = new WebUser({
        name: name,
        email: email,
        phone: phone,
        password: hashedpassword,
        confirm_password: hashedconfirm_password,
      });
      await webuser.save();

      return res.send({
        message: "User registered successfully",
        status: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static loginPOST = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      if (!email) {
        return res.status(400).send({
          message: "Email is required",
        });
      }
      if (!password) {
        return res.status(400).send({
          message: "Password is required",
        });
      }

      const webuser = await WebUser.findOne({
        email: req.body.email,
      });

      if (!webuser)
        return res.status(400).send({
          message: "User not found",
        });
      const validPassword = await bcrypt.compare(password, webuser.password);
      if (!validPassword)
        return res.status(401).send({
          message: "Invalid password",
        });

      const token = jwt.sign({ id: webuser._id }, process.env.TOKEN_SECRET);

      return res.status(200).send({
        message: "Login successful",
        user: {
          id: webuser._id,
          name: webuser.name,
          email: webuser.email,
          phone: webuser.phone,
        },
        success: true,
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static user_profile = async (req, res) => {
    try {
      const mediaUrl = baseURL + "/uploads/webusers/";
      // Middleware NotLoggedIn already validates token and sets req.id
      const user = await WebUser.findById(req.id);
      if (!user)
        return res.status(400).send({
          message: "User not found",
          success: false,
        });

      res.send({
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          state: user.state,
          city: user.city,
          pincode: user.pincode,
          image: user.image,
        },
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

  static update_profile = async (req, res) => {
    try {
      // File upload
      upload(req, res, async function (err) {
        if (err) {
          return res.status(500).send({
            message: "Error uploading file",
            error: err.message, // Detailed error message
          });
        }

        // Middleware NotLoggedIn already validates token and sets req.id
        const user = await WebUser.findById(req.id);

        if (!user) {
          return res.status(404).send({
            message: "User not found",
            success: false,
          });
        }

        let data = {
          image: req.file ? req.file.filename : "",
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          state: req.body.state,
          city: req.body.city,
          pincode: req.body.pincode,
        };

        let userData = {};
        for (let key in data) {
          if (data[key] !== "") {
            userData[key] = data[key]; // Only include non-empty fields
          }
        }

        // *Email number uniqueness check** first
        if (data.email && data.email !== user.email) {
          const emailExists = await WebUser.findOne({
            email: data.email,
          });

          if (emailExists) {
            return res.status(400).send({
              message: "Email already registered",
            });
          }
        }

        // **Profile update after phone verification**
        await WebUser.findByIdAndUpdate(user._id, { $set: userData });

        // Fetch the updated profile and return the response
        let updatedUser = await WebUser.findById(user._id);

        return res.status(201).send({
          message: "Profile updated successfully",
          status: true,
          success: true,
          data: updatedUser,
          mediaUrl: baseURL + "/uploads/webusers/",
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong, please try again later",
        error: error.message,
      });
    }
  };

  static change_password = async (req, res) => {
    try {
      const { password, new_password, confirm_password } = req.body;

      // Middleware NotLoggedIn already validates token and sets req.id
      const user = await WebUser.findById(req.id);
      if (!user)
        return res.status(401).send({
          message: "User not found",
        });

      if (!password) {
        return res.status(400).send({
          message: "Old Password is required",
        });
      }

      if (!new_password)
        return res.status(400).send({
          message: "New Password is required",
        });

      // Check if the old password and the new password are the same
      if (password === new_password) {
        return res.status(400).send({
          message:
            "Old and new password are the same, kindly use a new password",
        });
      }

      if (new_password !== confirm_password) {
        return res.status(400).send({
          message: "Password and Confirm Password do not match",
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send({
          message: "Invalid Old Password",
        });

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(new_password, salt);
      const hashedConfirmPassword = await bcrypt.hash(confirm_password, salt);

      await WebUser.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPassword },
        { confirm_password: hashedConfirmPassword }
      );
      return res.status(200).send({
        message: "password changed successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };

  static forgot_password = async (req, res) => {
    const encrypt = (text) => {
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    };
    try {
      const { url, email } = req.body;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const user = await WebUser.findOne({ email });

      if (!user) {
        return res.status(400).send({ message: "user not found" });
      }

      if (!url) {
        return res.status(400).send({ message: "Url not found" });
      }

      // Generate a token containing the email information
      const emailToken = encrypt(email);

      // Create the reset password URL
      const resetPasswordUrl = `${url}?email=${encodeURIComponent(emailToken)}`;

      const webSettings = await WebSetting.findOne();
      const logoUrl = webSettings
        ? `${baseURL}/uploads/websetting/${webSettings.logo}`
        : `${baseURL}/admin/images/logo.png`;
      const facebook = webSettings ? webSettings.facebook : "#";
      const twitter = webSettings ? webSettings.twitter : "#";
      const instagram = webSettings ? webSettings.instagram : "#";

      const name = user.name ? user.name : "Guest";
      const title = `Reset Your Password`;
      const heading = `Reset Your Password!`;
      const message = `Thank you for joining us! We're thrilled to have you on board.`;

      if (user) {
        const HTML_TEMPLATE = await ejs.renderFile(
          path.join(
            __dirname,
            "../../views/mail-templates/forgot-password.ejs"
          ),
          {
            name,
            title,
            heading,
            message,
            logoUrl,
            facebook,
            twitter,
            instagram,
            resetPasswordUrl,
          }
        );

        const body = { email, name };
        const subject = `Hi ${body.name}, Reset Your Password!`;
        await sendEmail(subject, body, HTML_TEMPLATE);
      }

      return res.status(200).send({
        Token: user ? emailToken : "",
        message: user
          ? "mail Sent Successfully, Please Check Your Mail!"
          : "Email is Not Exists!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong, please try again later",
        error: error.message,
      });
    }
  };

  static logout = async (req, res) => {
    try {
      req.session.destroy();
      return res.send({
        message: "logged out successfully",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Something went wrong please try again later",
        error: error.message,
      });
    }
  };
}

module.exports = webauthController;

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/webusers"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter: imageFilter,
}).single("image");
