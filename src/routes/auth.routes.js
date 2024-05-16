const router = require("express").Router();
const {
  SignUp,
  LogOut,
  SignIn,
  GetNewAccessToken,
} = require("../controllers/auth.controller");
const Limiter = require("../middleware/rateLimit");

router.post("/register", Limiter, SignUp);
router.patch("/sign-in", Limiter, SignIn);
router.put("/refresh", Limiter, GetNewAccessToken);

module.exports = router;
