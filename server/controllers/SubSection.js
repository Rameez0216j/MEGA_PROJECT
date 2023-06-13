const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// creation of SubSection
exports.createSubSection = async (req, res) => {
    try {
        // fetching data from req.body
        const { sectionId, title, description } = req.body;
        // extract Video/file
        const video = req.files.video;
        // validation
        if (!sectionId || !title || !description || !video) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        );
        // create a sub-section
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration: `${uploadDetails.duration}`,
            description,
            videoUrl: uploadDetails.secure_url,
        });

        // update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSections: subSectionDetails._id,
                },
            },
            { new: true }
        )
            .populate("subSections")
            .exec();

        // TODO: log updated section here, after adding populate query
        // return response
        return res.status(200).json({
            success: true,
            message: "Sub section Created Successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// HW : Update Subsection
// HW: deleteSubsection

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, title, description } = req.body;
        const subSection = await SubSection.findById(sectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save();

        return res.json({
            success: true,
            message: "Section updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSections: subSectionId,
                },
            }
        );
        const subSection = await SubSection.findByIdAndDelete({
            _id: subSectionId,
        });

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" });
        }

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        });
    }
};
