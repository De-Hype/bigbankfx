// const Passport = require("passport");
const router = require("express").Router();
const {
  SignUp,
  LogOut,
  SignIn,
  GetNewAccessToken,
} = require("../controllers/auth.controller");
// const VerifyToken = require("../middleware/VerifyToken");
const Limiter = require("../middleware/rateLimit");

router.post("/register", Limiter, SignUp);
router.patch("/sign-in", Limiter, SignIn);
router.put("/refresh", Limiter, GetNewAccessToken);

// router.get(
//   "/google",
//   Passport.authenticate("google", {
//     scope: ["profile"],
//   })
// );
// router.get("/google/redirect", Passport.authenticate("google"), GoogleRedirect);

module.exports = router;
