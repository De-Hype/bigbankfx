const AppError = require("../errors/AppError");

function CheckRole(role) {
    return(req, res, next)=>{
        if(req.user.payload.role === role){
            return next()
        } else{
            return next(new AppError(" You are not authorized to perform this action.", 403))
        };
    };
};

module.exports = CheckRole;

