const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    plan:{
        type:String,
        enum:["basic", "silver", "gold"],
        required:true
    },
    total_balance:{
        type:Number,
    },
    prev_deposit:{
        type:Number,
    },
    new_deposit:{
        type:Number,
    },
    profit:{
        type:Number,
    }
    
    
    // googleId:{
    //     type:String,
    //     default:null
    // },
    // githubId:{
    //     type:String,
    //     default:null
    // }
    
}, {timestamps:true})

const User = mongoose.model("user", userSchema);
module.exports = User