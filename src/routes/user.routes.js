const router = require("express").Router();
const { UpdatePlan } = require("../controllers/user.controller");
// const VerifyToken = require("../middleware/VerifyToken");
const Limiter = require("../middleware/rateLimit");

const VerifyToken = require("../middleware/VerifyToken");

router.get(
  "/update-plan",
  Limiter,
   VerifyToken,
  // CheckRole("admin"),
UpdatePlan
  
);


module.exports = router;
