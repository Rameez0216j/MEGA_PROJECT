const jwt=require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


// Auth
exports.auth = async(req,res,next)=>{
    try{
        // extract token
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        // if token missing then return the response
        // console.log("Token :",token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            })
        }

        // console.log("Token received in auth Middleware",token)


        // Verify the token
        try{
            const decode=jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode);
            req.user=decode;
        }catch(err){
            // Verification- issue
            return res.status(401).json({
                success:true,
                message:"Token is Invalid (in auth middleware)"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}


// isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not verified,please try again"
        })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructors only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not verified,please try again"
        })
    }
}


// isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role is not verified,please try again"
        })
    }
}