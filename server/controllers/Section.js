const Section = require("../models/Section");
const Course = require("../models/Course");
const mongoose=require("mongoose");
const SubSection = require("../models/SubSection");

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
        const { sectionName, sectionId, courseId } = req.body;

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

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSections",
			},
		})

        // return response
        return res.status(200).json({
            success: true,
            message:section,
            data:course
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
// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSections}});

        // deleting Section
		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSections"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   
