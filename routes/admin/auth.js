const router = require("express").Router();
const Adminauth = require("../../models/Adminauth");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const AuthController = require("../../controllers/admin/authController");
const multer = require("multer");
const root = process.cwd();
const path = require("path");
const fs = require("fs");
const imageFilter = require("../../config/imageFilter");

router.get("/login", AuthController.login);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // Consider sending a more specific error message or rendering the login page with an error
      return res.status(400).send("Email and password are required.");
    }

    // Try finding an admin first
    let admin = await Adminauth.findOne({ email: email });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).send("Invalid Credentials"); // Use generic message
      }
      // Set admin session
      req.session.admin_user = {
        _id: admin._id,
        email: admin.email,
        // Avoid storing password in session
        isAdmin: true, // Flag to indicate admin
      };
      req.session.user = null; // Clear user session if any
      return res.status(200).send(req.session.path || "/admin/dashboard"); // Redirect to dashboard or intended path
    }

    // If not an admin, try finding a regular user
    let user = await User.findOne({ email: email }).populate({
      path: "role",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });

    if (!user) {
      return res.status(401).send("Account not found"); // User or admin not found
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid Credentials"); // Use generic message
    }

    // --- Prepare permissions object ---
    const permissions = {};
    if (user.role && user.role.permissions) {
      user.role.permissions.forEach((perm) => {
        permissions[perm.module] = perm.permissions; // Store { manage: true, create: false, ... }
      });
    }
    // --- End Prepare permissions object ---

    // Set user session
    req.session.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role ? user.role.name : "User", // Store role name
      permissions: permissions, // Store processed permissions
      isAdmin: false,
    };
    req.session.admin_user = null; // Clear admin session if any

    // Redirect to dashboard or intended path
    return res.status(200).send(req.session.path || "/admin/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("An internal server error occurred.");
  }
});

router.get("/changepassword", NotLoggedIn, async (req, res) => {
  const admin = await Adminauth.findOne({ username: req.session.username });
  const settingRecord = await Setting.findOne({});
  return res.render("admin/changepassword", { admin, settingRecord });
});
router.post("/changepassword", NotLoggedIn, async (req, res) => {
  try {
    const newpassword = req.body.newpassword;
    if (newpassword.length < 6)
      return res.send("Password must be at least 6 charactors long");
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    await Adminauth.updateOne({
      password: hashedPassword,
    });
    return res.send({
      error: false,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.send("Something went wrong please try again later");
  }
});

router.get("/profile_update", NotLoggedIn, async (req, res) => {
  const admin = await Adminauth.findOne({ username: req.session.username });
  const settingRecord = await Setting.findOne({});
  return res.render("admin/profile_update", { admin, settingRecord });
});

router.post("/profile_update", NotLoggedIn, async (req, res) => {
  try {
    upload(req, res, async function (err) {
      const admin_profile = await Adminauth.findOne({
        _id: req.session.user,
      });

      await Adminauth.findOneAndUpdate(
        {
          _id: req.session.user,
        },
        {
          image: req.file ? req.file.filename : admin_profile.image,
          name: req.body.name,
          email: req.body.email,
          mobile_number: req.body.mobile_number,
          updated_at: Date.now(),
        }
      );

      if (req.file) {
        fs.unlinkSync(root + "/public/uploads/profile/" + admin_profile.image);
      }

      await admin_profile.save();

      return res.send({
        error: false,
        message: "Profile Updated Successfully",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

router.post("/logout", NotLoggedIn, async (req, res) => {
  try {
    req.session.destroy();
    return res.send("success");
  } catch (error) {
    return res.send("Something went wrong please try again later");
  }
});

router.post("/add-user", async (req, res) => {
  try {
    req.body.role = "manager";
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const exist = await Adminauth.findOne({
      username: req.body.username,
    });
    if (exist) {
      return res.send({
        error: true,
        message: "User Already Exists",
      });
    }
    const user = Adminauth(req.body);
    await user.save();
    return res.send({ error: false, message: "User added successfully" });
  } catch (error) {
    return res.send("Something went wrong please try again later");
  }
});
router.post("/edit-user", async (req, res) => {
  try {
    req.body.role = "manager";

    data = {
      email: req.body.email,
      mobile_number: req.body.mobile_number,
      role: req.body.role,
      markets: req.body.markets,
      username: req.body.username,
    };
    if (req.body.password !== "") {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      data.password = await bcrypt.hash(req.body.password, salt);
    }
    await Adminauth.findByIdAndUpdate(req.body.id, data);
    return res.send({ error: false, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong please try again later");
  }
});

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/profile"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("image");

module.exports = router;
