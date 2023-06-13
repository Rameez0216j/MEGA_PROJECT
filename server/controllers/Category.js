const Category=require("../models/Category");


// create Category handler function
exports.createCategory = async(req,res)=>{
    try{
        // fetching data from req.body
        const {name,description} = req.body;
        // Validating data
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // create a DB entry
        const CategoryDetails=await Category.create({
            name:name,
            description:description
        })
        console.log(CategoryDetails)

        return res.status(200).json({
            success:true,
            message:"Category Created Successfully!"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Category Creation failed!"
        })
    }
}




// getAll Category details
exports.showAllCategories = async (req,res)=> {
    try{
        const allCategory=await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"Category fetched Successfully!",
            allCategory
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occured while fetching Category!"
        })
    }
}


//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            //get courses for different categories
            const differentCategories = await Category.find({id: {$ne: categoryId},})
                .populate("courses")
                .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}