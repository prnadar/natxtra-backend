const main = require("./routes/web/main");
const webAuth = require("./routes/web/webAuth");
const dashboard = require("./routes/web/dashboard");
const webApi = require("./routes/web/webApi");
const payment = require("./routes/web/payment");

const WebRoutes = (app) => {
  app.use("/", main);
  app.use("/web", dashboard);
  app.use("/web/user", webAuth);
  app.use("/web/api", webApi);
  app.use("/web/user", payment);
};

module.exports = WebRoutes;
