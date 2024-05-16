const router = require("express").Router();
const { UpdatePlan, DeleteUser } = require("../controllers/user.controller");
const CheckRole = require("../middleware/CheckRole");
const CheckUserPlan = require("../middleware/CheckUserPlan");
const Limiter = require("../middleware/rateLimit");
const VerifyAccessToken = require("../middleware/VerifyAccessToken");

router.patch("/update-plan", Limiter, VerifyAccessToken, UpdatePlan);
router.delete(
  "/delete-user",
  Limiter,
  VerifyAccessToken,
//   CheckRole("admin"),
  DeleteUser
);

module.exports = router;
