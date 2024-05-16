const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    publicId:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,  
    },
    role:{
        type:String,
        default:"admin",
        required:true
    },
    
    
}, {timestamps:true})

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin