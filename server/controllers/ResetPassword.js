const User= require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const PORT=process.env.PORT;
const FRONTEND_PORT=process.env.FRONTEND_PORT;

// resetPasswordToken
exports.resetPasswordToken = async(req,res) =>{
    try{
        // get email from req.body
        const email=req.body.email;
        // check user for this mail exist or not (email validation)
        const user=await User.findOne({email:email});

        // if user does not exist
        if(!user){
            return res.json({
                success:false,
                message:"Your Email is not registered with us"
            });
        }

        // if user exists generate token
        const token = crypto.randomBytes(20).toString("hex");
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            // adds below attribute to User
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}
        )
        console.log("DETAILS", updatedDetails);

        // create url for frontEnd password reset
        const url =`http://localhost:${FRONTEND_PORT}/update-password/${token}`
        // send mail containing the url
        await mailSender(email,
            "Password reset link",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`)

        // return response
        return res.json({
            success:true,
            message:"Email sent successful, please check email and change your password"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Something went wrong while sending reset password mail"
        })
    }
}



// resetPassword
exports.resetPassword = async(req,res)=>{
    try{
        // fetching data from req.body
        const {password,confirmPassword,token}=req.body;

        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password and Confirm Password Does not Match"
            })
        }

        // get user details from Database using token
        const userDetails = await User.findOne({token:token});

        // if no entry is found - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                massage:"Token is inValid"
            })
        }

        // token time checking (if expired or not)
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success:false,
                message:"Token is expired, please regenerate your token"
            })
        }

        // hash new password
        const encryptedPassword=await bcrypt.hash(password,10);
        // password update
        await User.findOneAndUpdate(
            {token:token},
            {password:encryptedPassword},
            {new:true}
        )

        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset successful"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while updating password"
        });
    }
}