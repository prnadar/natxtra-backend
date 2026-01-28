const Unit = require("../../models/Unit");

class UnitController {
  static list = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page number, default to 1
      const pageSize = parseInt(req.query.pageSize) || 15; // Items per page, default to 10
      const totalItems = await Unit.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      let units = await Unit.find()
        .sort({ created_at: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.render("admin/unit", {
        admin: req.user, // Pass user/admin data from middleware
        user: req.user,
        isAdmin: req.isAdmin,
        userPermissions: req.userPermissions,
        units,
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error retrieving units: " + error.message,
      });
    }
  };

  static add = async (req, res) => {
    try {
      const insertRecord = new Unit({
        name: req.body.name,
      });
      await insertRecord.save();
      return res.send({
        status: 200,
        message: "Unit added successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error add unit: " + error.message,
      });
    }
  };

  static edit = async (req, res) => {
    try {
      const { editid, edit_name } = req.body;

      const unit = await Unit.findOne({
        _id: editid,
      });
      await Unit.findOneAndUpdate(
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
        message: "Units updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error update units: " + error.message,
      });
    }
  };

  static deleteUnit = async (req, res) => {
    try {
      await Unit.findByIdAndDelete(req.body.id);
      res
        .status(200)
        .send({ message: "Unit Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Unit Deletion Failed.", error: true });
    }
  };

  static deleteUnits = async (req, res) => {
    try {
      await Unit.deleteMany({ _id: req.body });
      res
        .status(200)
        .send({ message: "Unit Deleted Successfully.", error: false });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Unit Deletion Failed.", error: true });
    }
  };
}

module.exports = UnitController;
