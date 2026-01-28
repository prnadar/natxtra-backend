const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const HRMSController = require("../../controllers/admin/hrmsController");

router.get("/HRMS-Dash", NotLoggedIn, HRMSController.dashboard);
router.get("/attendance-system", NotLoggedIn, HRMSController.attendenceSystem);

// #region Leave Management
router.get("/leave-management", NotLoggedIn, HRMSController.leaveManagement);
router.post("/leave-add", NotLoggedIn, HRMSController.addLeave);
router.post("/leave-edit", NotLoggedIn, HRMSController.editLeave);
router.post(
  "/leave-update-status",
  NotLoggedIn,
  HRMSController.updateLeaveStatus
);
router.post("/leave-delete", NotLoggedIn, HRMSController.deleteLeave);
router.post("/leaves-delete", NotLoggedIn, HRMSController.deleteLeaves);
// #endregion

// #region office calender
router.get("/office-calander", NotLoggedIn, HRMSController.officeCalender);
router.get("/office-calander/events", NotLoggedIn, HRMSController.getAllEvents);
router.post("/save-office-event", NotLoggedIn, HRMSController.saveEvent);
router.post("/update-office-event/:id", HRMSController.updateEvent);
router.post("/delete-office-event/:id", HRMSController.deleteEvent);
// #endregion

router.get("/salary-slip-manage", NotLoggedIn, HRMSController.salarySlipManage);
router.post(
  "/generate-salary-slip",
  NotLoggedIn,
  HRMSController.generateSalarySlip
);
router.get(
  "/download-salary-slip",
  NotLoggedIn,
  HRMSController.downloadSalarySlipPDF
);

//#region Termination
router.get(
  "/resign-termination",
  NotLoggedIn,
  HRMSController.resignTermination
);
router.post("/termination-add", NotLoggedIn, HRMSController.addTermination);
router.post("/termination-edit", NotLoggedIn, HRMSController.editTermination);
router.post(
  "/termination-update-status",
  NotLoggedIn,
  HRMSController.updateTerminationStatus
);
router.post(
  "/termination-delete",
  NotLoggedIn,
  HRMSController.deleteTermination
);
router.post(
  "/terminations-delete",
  NotLoggedIn,
  HRMSController.deleteTerminations
);
// #endregion

module.exports = router;
