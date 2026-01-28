const Status = require("../models/Status");

const createUserStatus = async () => {
  const checkAndUpdateStatus = async (name) => {
    let status = await Status.findOne({
      type: "user",
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (status) {
      let needsUpdate = false;
      if (status.name.toLowerCase() !== name.toLowerCase()) {
        status.name = name;
        needsUpdate = true;
      }
      if (status.type !== "user") {
        status.type = "user";
        needsUpdate = true;
      }
      if (needsUpdate) {
        await status.save();
      }
    } else {
      status = new Status({ name, type: "user" });
      await status.save();
    }
  };
  await checkAndUpdateStatus("active");
  await checkAndUpdateStatus("inactive");
  // await checkAndUpdateStatus("banned");
};

const createDistributorStatus = async () => {
  const checkAndUpdateStatus = async (name) => {
    let status = await Status.findOne({
      type: "distributor",
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (status) {
      let needsUpdate = false;
      if (status.name.toLowerCase() !== name.toLowerCase()) {
        status.name = name;
        needsUpdate = true;
      }
      if (status.type !== "distributor") {
        status.type = "distributor";
        needsUpdate = true;
      }
      if (needsUpdate) {
        await status.save();
      }
    } else {
      status = new Status({ name, type: "distributor" });
      await status.save();
    }
  };
  await checkAndUpdateStatus("active");
  await checkAndUpdateStatus("inactive");
  // await checkAndUpdateStatus("banned");
};

const createCategoryStatus = async () => {
  const checkAndUpdateStatus = async (name) => {
    let status = await Status.findOne({
      type: "category",
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (status) {
      let needsUpdate = false;
      if (status.name.toLowerCase() !== name.toLowerCase()) {
        status.name = name;
        needsUpdate = true;
      }
      if (status.type !== "category") {
        status.type = "category";
        needsUpdate = true;
      }
      if (needsUpdate) {
        await status.save();
      }
    } else {
      status = new Status({ name, type: "category" });
      await status.save();
    }
  };
  await checkAndUpdateStatus("active");
  await checkAndUpdateStatus("inactive");
};

module.exports = {
  createUserStatus,
  createDistributorStatus,
  createCategoryStatus,
};
