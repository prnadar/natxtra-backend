const Adminauth = require("../models/Adminauth");
const User = require("../models/User"); // Import User model
const Role = require("../models/Role"); // Import Role model
const Permission = require("../models/Permission"); // Import Permission model

// Middleware to check if user is logged in (either admin or regular user)
const NotLoggedIn = async (req, res, next) => {
  req.session.path = req.originalUrl; // Store intended path

  // Check for admin session first
  if (req.session.admin_user && req.session.admin_user.email) {
    try {
      const admin = await Adminauth.findById(req.session.admin_user._id);
      if (admin) {
        req.user = admin; // Attach admin user object to request
        req.isAdmin = true; // Flag for admin
        req.userPermissions = {}; // Admins might have implicit full access or handle differently
        return next(); // Admin is logged in
      } else {
        // Admin record not found, clear session
        req.session.destroy();
        return res.redirect("/admin/login");
      }
    } catch (error) {
      console.error("Admin session check error:", error);
      req.session.destroy();
      return res.redirect("/admin/login");
    }
  }

  // Check for regular user session
  if (req.session.user && req.session.user.email) {
    try {
      // User data including permissions should already be in the session from login
      const userSessionData = req.session.user;
      const user = await User.findById(userSessionData._id); // Verify user still exists

      if (user) {
        req.user = user; // Attach user object to request
        req.isAdmin = false;
        // Permissions are already processed and stored in the session
        req.userPermissions = userSessionData.permissions || {};
        return next(); // User is logged in
      } else {
        // User record not found, clear session
        req.session.destroy();
        return res.redirect("/admin/login");
      }
    } catch (error) {
      console.error("User session check error:", error);
      req.session.destroy();
      return res.redirect("/admin/login");
    }
  }

  // If neither admin nor user session is valid, redirect to login
  return res.redirect("/admin/login");
};

// This middleware seems unused based on routes, keeping it for reference
const LoggedIn = (req, res, next) => {
  if (req.session.user || req.session.admin_user) {
    // Already logged in, perhaps redirect to dashboard?
    // Or maybe this is intended for the login page itself?
    // If accessing login page while logged in, redirect away
    if (req.originalUrl.includes("/admin/login")) {
      return res.redirect("/admin/dashboard");
    }
    next(); // Or proceed if it's not the login page
  } else {
    // Not logged in, allow access (e.g., to login page)
    if (req.originalUrl.includes("/admin/login")) {
      return next();
    }
    // If trying to access other pages, redirect to login (handled by NotLoggedIn)
    res.redirect("/admin/login");
  }
};

module.exports = {
  LoggedIn, // Keep if needed elsewhere
  NotLoggedIn,
};
