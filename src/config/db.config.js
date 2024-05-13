const mongoose = require("mongoose");
require("dotenv").config();

const Connect =async ()=>{
    try {
        console.log(process.env.DB_URI)
        await mongoose.connect(process.env.DB_URI);
        console.log("DB connected succesfully")
    } catch (error) {
        console.log(error)
        console.error("DB connection failed")
    }
} 
module.exports = Connect
// morgan, nodem