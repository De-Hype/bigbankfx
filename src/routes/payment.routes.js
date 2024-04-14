const router = require("express").Router();

const { InitializePayment } = require("../controllers/payment.controller");
const CheckRole = require("../middleware/CheckRole");
const VerifyToken = require("../middleware/VerifyToken");


router.post("/initialize-payment", VerifyToken, CheckRole("user"), InitializePayment);
router.get('/verify-payment/:reference', VerifyToken, CheckRole("user"), VerifyPayment);


module.exports = router;
