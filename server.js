const express = require("express");
const app = express();

process.on("uncaughtException", (err)=>{
    console.log(err.name, err.message);
    console.log("Unhandled Exception, shutting down...");
    process.exit(1)
});

module.exports = app