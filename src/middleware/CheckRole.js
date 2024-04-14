const AppError = require("../errors/AppError");

function CheckRole(role) {
    return(req, res, next)=>{
        if(req.user.role === role){
            return next()
        } else{
            return next(new AppError("You are not authorized for this action", 403))
        };
    };
};

module.exports = CheckRole;
// A ride booking app
// Google map
// A bolt kinda app
// Keke, to be used in Anambra, awka, Onitsha, Asaba starting with 
// Shared lift, and personal lift
// logistics
// Transfers and cash
// Driver get a percentage

