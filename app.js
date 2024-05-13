const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
const Connect = require("./src/config/db.config");
const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");

const GlobalErrorHandler = require("./src/errors/errorHandler");
const AppError = require("./src/errors/AppError");

const app = express(); 
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Exception, shutting down...");
  process.exit(1);
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));

//Routes will go in here
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/user", userRoutes);
app.use("/v1/api/admin", adminRoutes);

//Error Handlers
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can not find ${req.originalUrl} with ${req.method} on this server`,
      501
    )
  );
});
app.use(GlobalErrorHandler);

const Port = process.env.PORT || 8080;
const server = Connect().then(() => {
  app.listen(Port, () => {
    console.log(`Server runing on ${Port}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection, shutting down server...");
  server.close(() => {
    process.exit(1);
  });
});
