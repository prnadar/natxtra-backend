const Permission = require("../models/Permission");

const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      if (req.session?.admin_user?.isAdmin) {
        // Admins have full access
        return next();
      }

      console.log(req.session?.user?.permissions ?? []);

      const userPermissions = req.session?.user?.permissions ?? [];
      if (userPermissions[module] && userPermissions[module][action]) {
        return next();
      }

      return res.status(401).send({
        message: "Access Denied: Insufficient Permissions",
        status: false,
      });
    } catch (error) {
      console.error("Permission check error:", error.message);
      return res.status(500).send("Internal Server Error", error.message);
    }
  };
};

module.exports = checkPermission;
