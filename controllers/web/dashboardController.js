// const Adminauth = require("../../models/Adminauth");

class DashboardController {
  static dashboard = async (req, res) => {
    try {
      // const admin = await Adminauth.findOne({
      //   email: req.session.email,
      // });
      return res.render("web/index");
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
}

module.exports = DashboardController;
