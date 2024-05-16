const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

function VerifyAccessToken(req, res, next) {
  const token = req.cookies.big_bank_fx_access_token;
  console.log(token)
  if (!token) {
    return next(new AppError("Invalid token, Unauthorized", 401));
  }
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_CREATE, (err, decoded) => {
    if (err) {
      return next(
        new AppError("Incorrect or expired token, please log in", 401)
      );
    }
    req.user = decoded;
    console.log(req.user)
    next();
  });
}

module.exports = VerifyAccessToken;
