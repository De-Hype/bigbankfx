const jwt = require("jsonwebtoken");

const GenerateAccessToken = (payload, secret) => {
  if (!secret) return;
  if (!payload) return;

  const token = jwt.sign({ payload }, secret, {
    expiresIn: "15m",
  });

  return token;
};

const GenerateRefreshToken = (payload, secret, validTill = false) => {
  if (!secret) return;
  if (!payload) return;
  const date = validTill ? "6d" : "1d";
  const token = jwt.sign({ payload }, secret, {
    expiresIn: date,
  });
  return token;
};
module.exports = {
  GenerateAccessToken,
  GenerateRefreshToken,
};
