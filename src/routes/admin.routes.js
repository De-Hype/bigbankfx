const router = require("express").Router();
const {
  FetchAllUsers,
  FetchAllTransactionsHistory,
  AdminSignUp,
  AdminSignIn,
} = require("../controllers/admin.controller");
const CheckRole = require("../middleware/CheckRole");
const Limiter = require("../middleware/rateLimit");
const VerifyAccessToken = require("../middleware/VerifyAccessToken");

router.get(
  "/fetch-all-users",
  Limiter,
  VerifyAccessToken,
  CheckRole("admin"),
  FetchAllUsers
);
router.post("/admin-register", Limiter, AdminSignUp);
router.patch("/admin-sign-in", Limiter, AdminSignIn);
// router.get(
//   "/fetch-transaction-history",
//   Limiter,
//   VerifyToken,
//   CheckRole("admin"),
//   FetchAllTransactionsHistory
// );

module.exports = router;
