class AuthController {
  static login = async (req, res) => {
    // Add userPermissions and isAdmin as null/false since this is the login page
    // before authentication
    return res.render("admin/login", {
      userPermissions: null,
      isAdmin: false,
    });
  };
}

module.exports = AuthController;
