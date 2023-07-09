const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
// Method for updating a profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            dateOfBirth = "",
            about = "",
            contactNumber,
            gender,
            firstName,
            lastName,
        } = req.body;
        const id = req.user.id;

        // Find the profile by id
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);

        // Update the profile fields
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;

        // updating user details
        userDetails.firstName = firstName;
        userDetails.lastName = lastName;

        // Save the updated profile and userdetails in database
        await profile.save();
        await userDetails.save();

        const updatedUserDetails = await User.findById(id).populate(
            "additionalDetails"
        );

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        console.log("Reading ID : ", req.user);
        const id = req.user.id;
        console.log(id);
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Delete Associated Profile with the User
        await Profile.findByIdAndDelete({ _id: user.additionalDetails });
        // TODO: Unenroll User From All the Enrolled Courses
        // Now Delete User
        await User.findByIdAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Unable to delete Account",
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        console.log("Uploading Image");
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );
        console.log("Updating User");
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: [
                    {
                        path: "instructor",
                        populate: {
                            path: "additionalDetails",
                        },
                    },
                    {
                        path: "category",
                    },
                    {
                        path: "ratingAndReviews",
                    },
                    {
                        path: "courseContent",
                        populate: {
                            path: "subSections",
                        },
                    },
                ],
            })
            .exec();

        // populate({
        //     path: "instructor",
        //     populate: {
        //         path: "additionalDetails",
        //     },
        // })
        // populate("category")
        // populate("ratingAndReviews")
        // populate({
        //     path: "courseContent",
        //     populate: {
        //         path: "subSections",
        //     },
        // })
        // .exec();

        // console.log("Executed upto here 1")
        // console.log("Executed upto here 001")
        var SubsectionLength = 0;
        // for all sections
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            SubsectionLength = 0;
            // for all sections
            for (
                var j = 0;
                j < userDetails.courses[i].courseContent.length;
                j++
            ) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSections.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration),
                    0
                );
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                );
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSections.length;
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userID: userId,
            });
            // console.log("Executed upto here 2")
            courseProgressCount = courseProgressCount?.completedVideos.length;
            // console.log("Executed upto here 3")
            if (SubsectionLength === 0) {
                // there is no such field like progressPercentage in course modal it is done for an object named useretails for data of course completion

                // console.log("Executed upto here 4")
                userDetails.courses[i].progressPercentage = 100;
                // console.log("Executed upto here 5")
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) *
                            100 *
                            multiplier
                    ) / multiplier;
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.instructorDashboard = async (req, res) => {
    try {
        const CourseDetails = await Course.find({ instructor: req.user.id });
        const courseData = CourseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // creating an object for the additional info
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
            return courseDataWithStats;
        });
        res.status(200).json({
            success: true,
            course: courseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
