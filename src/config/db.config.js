const mongoose = require("mongoose");
require("dotenv").config();

const Connect =async ()=>{
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("DB connected succesfully")
    } catch (error) {
        console.error("DB connection failed")
    }
} 
module.exports = Connect
// morgan, nodem