
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.isAuthenticated = async (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
        console.log("accessToken",accessToken);
        if(!accessToken){
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode = await jwt.verify(accessToken, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:'Invalid',
                success:false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
}
