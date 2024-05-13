const router = require("express").Router();
const {
  FetchAllUsers,
  FetchAllTransactionsHistory,
} = require("../controllers/admin.controller");
const CheckRole = require("../middleware/CheckRole");
const Limiter = require("../middleware/rateLimit");
const VerifyToken = require("../middleware/VerifyToken");

router.get(
  "/fetch-all-users",
  Limiter,
  // VerifyToken,
  // CheckRole("admin"),
  FetchAllUsers
);
router.get(
  "/fetch-transaction-history",
  Limiter,
  VerifyToken,
  CheckRole("admin"),
  FetchAllTransactionsHistory
);

module.exports = router;
