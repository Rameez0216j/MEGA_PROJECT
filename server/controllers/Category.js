const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// create Category handler function
exports.createCategory = async (req, res) => {
    try {
        // fetching data from req.body
        const { name, description } = req.body;
        // Validating data
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // create a DB entry
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category Created Successfully!",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Category Creation failed!",
        });
    }
};

// getAll Category details
exports.showAllCategories = async (req, res) => {
    try {
        const allCategory = await Category.find(
            {},
            { name: true, description: true }
        );
        return res.status(200).json({
            success: true,
            message: "Category fetched Successfully!",
            allCategory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching Category!",
        });
    }
};

//categoryPageDetails

exports.categoryPageDetails = async (req, res) => {
    try {
        //get categoryId
        const { categoryId } = req.body;
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                populate: {
                    path: "ratingAndReviews",
                },
            })
            .exec();

        //validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
            });
        }

        // Handle the case when there are no courses
        if (selectedCategory?.courses?.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        });

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[
                getRandomInt(categoriesExceptSelected.length)
            ]._id
        )
            .populate({
                path: "courses",
                populate: {
                    path: "ratingAndReviews",
                },
                match: { status: "Published" },
            })
            .exec();
        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    {
                        path: "instructor",
                    },
                    {
                        path: "ratingAndReviews",
                    },
                ],
            })
            .exec();

        // Explore flatMap
        const allCourses = allCategories.flatMap(
            (category) => category.courses
        );
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
