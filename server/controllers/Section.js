const Section = require("../models/Section");
const Course = require("../models/Course");
const mongoose=require("mongoose");

exports.createSection = async (req, res) => {
    try {
        // fetch data from req.data
        const { sectionName, courseId } = req.body;
        // Validating data
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details properly",
            });
        }

        // Create section
        const newSection = await Section.create({ sectionName });

        // Update Course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",

                },
            })
            .exec();

        // TODO : use populate to replace section/sub-sections both in the updatedCourseDetails (it is referred so i think no need to delete it from course)
        return res.status(200).json({
            success: true,
            message: "Section created Successfully",
            updatedCourseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some Error occured while creating section ",
            error: error.message,
        });
    }
};

// Updating Section
exports.updateSection = async (req, res) => {
    try {
        // fetch data from req.body
        const { sectionName, sectionId } = req.body;

        // data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Please fill out all the fields",
            });
        }

        // update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // return response
        return res.status(200).json({
            success: true,
            message:section
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, Please try Again",
            error: error.message,
        });
    }
};

// deleting section
exports.deleteSection = async (req, res) => {
    try {
        // get ID - assuming that we are sending ID in params
        const { sectionId } = req.body;

        // deleting the section from DB
        console.log(sectionId);
        const delSection=new mongoose.Types.ObjectId(sectionId);
        await Section.findByIdAndDelete( delSection );

        //TODO[Testing]: do we need to delete the entry from the course schema ?? Ans is Yes (H/W)


        // returning response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try Again",
            error: error.message,
        });
    }
};
