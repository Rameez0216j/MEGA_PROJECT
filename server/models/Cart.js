const mongoose = require("mongoose");

// Define the Courses schema
const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	cart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
	price: {
		type: Number,
	},
});

// Export the Courses model
module.exports = mongoose.model("Cart", cartSchema);