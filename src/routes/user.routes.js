const router = require("express").Router();
const { UpdatePlan } = require("../controllers/user.controller");
const CheckRole = require("../middleware/CheckRole");
const CheckUserPlan = require("../middleware/CheckUserPlan");
const Limiter = require("../middleware/rateLimit");
const VerifyAccessToken = require("../middleware/VerifyAccessToken");

router.patch(
  "/update-plan",
  Limiter,
  VerifyAccessToken,
//   CheckRole("admin"),
  //CheckUserPlan("basic"),
  UpdatePlan
);

module.exports = router;
