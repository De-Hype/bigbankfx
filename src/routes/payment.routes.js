const router = require("express").Router();

const { InitializePayment, VerifyPayment } = require("../controllers/payment.controller");
const CheckRole = require("../middleware/CheckRole");
const VerifyAccessToken = require("../middleware/VerifyAccessToken");
// const VerifyToken = require("../middleware/VerifyToken");

router.post(
  "/initialize-payment",
  VerifyAccessToken,

  InitializePayment
);
router.get(
  "/verify-payment/:reference",
  VerifyAccessToken,
  // CheckRole("user"),
  VerifyPayment
);

module.exports = router;
