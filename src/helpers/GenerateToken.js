const jwt = require("jsonwebtoken")

const GenerateToken = (payload,secret, validTill=false)=>{
    if(!secret) return 
    if(!payload) return 
    const date = validTill ? "6d":"1d";
    const token = jwt.sign({payload},secret,{
        expiresIn:date
    } );
    return token
}
module.exports = GenerateToken