import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "Not authorized, user not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error during token verification:", error.message);
        res.status(401).json({ message: "Not authorized" });
    }
}