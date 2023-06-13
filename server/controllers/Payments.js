const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
// another new way of importing
const { default: mongoose } = require("mongoose");


// capturing the payment and initiating the razorPay order
exports.capturePayment = async (req,res)=>{
    // fetching courseId and UserId
    const {course_id}=req.body;
    const userId = req.user.id;

    // Validations
    if(!course_id){
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    }

    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        // if user already paid for same course
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }


    // Create an order
    const amount=course.price;
    const currency = "INR";


    // creating options for creating an order in RazorPay
    const options={
        amount:course.price,
        currency,
        receipt:Math.random(Date,now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    }


    try{
        // initiating the payment using RazorPay
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);

        // return success response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
}



// verifying signature of RazorPay and server
exports.verifySignature = async (req,res)=>{
    const webhookSecret="12345678";

    // Practice followed by RazorPay team (Revise this section)
    const signature=req.headers["x-razorpay-signature"];
    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorized");
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try{
            // perform necessary Action
            //  find the course and enroll student in it
            const enrolledCourse = await Course.findOneAndDelete(
                {_id:courseId},
                {
                    $push:{studentsEnrolled:userId}
                },
                {new:true}
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'Course not Found',
                });
            }

            console.log(enrolledCourse);

            // find the student and the course to students courses enrolled list
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {
                    $push:{course:courseId}
                },
                {new:true}
            );
            console.log(enrolledStudent)

            // send confirmation mail
            const emailResponse =await mailSender(
                enrolledStudent.email,
                "congratulations from SkillsPoint",
                "Congratulations, you are on boarded into new SkillsPoint Course"
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature Verified and COurse Added",
            });

        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
}



