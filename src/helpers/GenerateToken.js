const jwt = require("jsonwebtoken");


const GenerateAccessToken = (payload, secret) => {
  console.log("Secret is", secret)
  console.log("Payload is", payload)
  if (!secret) return;
  if (!payload) return;

  const token = jwt.sign({ payload }, secret, {
    expiresIn: "15m",
  });
  console.log(token)
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
