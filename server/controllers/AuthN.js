const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
const Profile=require("../models/Profile");
require("dotenv").config();



// Send OTP
exports.sendotp = async(req,res) =>{
    try{
        // fetch email from request body
        const{email} = req.body;

        // check if user already exists
        const checkUserExist=await User.findOne({email});

        // if user already exists
        if(checkUserExist){
            return res.status(401).json({
                success:false,
                message:"User already registered"
            })
        }

        // No user exists with the provided mail 
        // Now Generate OTP
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })


        // check if otp is Unique in DB
        let result=await OTP.findOne({otp:otp});
        // if not unique otp then keep generating otp
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp});
        }

        console.log("Generated OTP :",otp);

        const otpPayload = {email,otp};
        // create an entry for OTP in DB;
        const otpBody=await OTP.create(otpPayload);
        // console.log(otpBody);

        // return response
        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}


// SignUP
exports.signup = async (req,res)=>{
    try{
        // fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;


        // validations
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        // match password and confirmPassword
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and ConfirmPassword Value does not match, please try again',
            });
        }

        // check if user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        // find most recent OTP stored for the user
        const response= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log("signup : ",response);

        // validate OTP 
        if(response.length==0){
            return res.status(400).json({
                success:false,
                message:'OTP Not Found',
            })
        } else if(otp!= response[0].otp){
            console.log(response)
            return res.status(400).json({
                success:false,
                message:'Invalid OTP',
                otp:otp,
                required_otp:response.otp,
            })
        }
        
        
        // OTP validated so hash and store the password
        const hashedPassword = await bcrypt.hash(password,10);

        let approved;
        approved === "Instructor" ? (approved = false) : (approved = true);
        // create entry in DataBase
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user= await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            approved,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // return response
        return res.status(200).json({
            success:true,
            message:"User is Registered Successfully!",
            user
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })
    }
}





// Login
exports.login = async(req,res)=>{
    try{
        // fetch data from req.body
        const {email , password}=req.body;

        // Validation
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, Kindly fill all details"
            })
        }

        // Check if user exists or not
        const user = await User.findOne({email}).populate("additionalDetails");
        // if user not found
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not Registered, please signup first"
            });
        }

        // generate JWT after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }

            const token= jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });
            
            // Save token to user document in database
            user.token=token;
            user.password=undefined;

            // create a cookie and send it as response
            const options={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully!"
            })
        }
        else{
            res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }

    }catch(error){
        console.log("Error Occured while logging in :",error.message)
        return res.status(500).json({
            success:false,
            message:"Login failed due to some error!"
        })
    }
}





// changePassword
// exports.changePassword = async (req,res) => {
    // get data from req.body
    //get oldPassword, newPassword, confirmNewPassword
    //validation
    //update pwd in DB
    //send mail - Password updated
    //return response
// }

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);
		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};