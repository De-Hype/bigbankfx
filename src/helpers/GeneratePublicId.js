const uuid = require("uuid");
const crypto = require("crypto");
require("dotenv").config();

function GeneratePublicId() {
  const dateStamp = new Date().toISOString();
  const uuidPart = uuid.v4().split("-").join("");
  
  const hashPart = crypto
    .createHash("sha256")
    .update(`${dateStamp}${uuidPart}${process.env.ID_GEN_KEY}`)
    .digest("hex")
    .slice(0, 25);

  return `${hashPart}${uuidPart}`;
}
module.exports = GeneratePublicId;
