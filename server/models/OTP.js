const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*50
    }
});


// Function to send mail for OTP verification
// The blow code snippet should always be written between model Schema and exporting modelSchema for accurate working
async function sendVerificationEmail(email,otp){
    try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		// console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		// console.log("Error occurred while sending email: ", error);
		throw error;
	}
}


// below code snippet is pre hook ( a kind of middleware) which handles sending mail for OTP when ex_function i.e "save" in below case is executed over the Model above before saving the entry in DataBase
// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");
	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;