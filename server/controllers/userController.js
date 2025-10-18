
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {fullName, email, password}= req.body;

    try{
        if (!fullName || !email || !password ) {
            return res.status(400).json({success:false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({success:false, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,email,password: hashedPassword
        });

        const token = generateToken(newUser._id);
        res.json({success:true, userData: newUser,token, message: "User created successfully" });
    } catch (error) {
        console.log("Error during signup:", error.message);
        res.status(500).json({ success:false, message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({success:false, message: "Email and password are required" });
        }
        const userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({success:false, message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success:false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id);
        res.json({success:true, userData, token, message: "Login successful" });
    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ success:false, message: "Internal server error" });
    }
}

export const checkAuth = (req,res)=>{
    res.json({success:true, user: req.user, message: "User is authenticated"});
}


