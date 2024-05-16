const AppError = require("../errors/AppError");

function CheckUserPlan(plan) {
    return(req, res, next)=>{
        if(req.user.payload.plan === plan){
            return next()
        } else{
            return next(new AppError("You can not perform this action.", 403))
        };
    };
};

module.exports = CheckUserPlan;

