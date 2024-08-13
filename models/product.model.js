const mongoose = require("mongoose");
const env = require('dotenv')
env.config()

const ProductSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		link: { type: String, required: true },
		image: { type: String, required: true },
		priceShow: { type: String, required: true },
		priceThrough: { type: String, required: true },
		discountPercent: { type: String, required: true },
		rating: { type: String, required: true },
		promotions: [{ type: String }]
	},
	{
		versionKey: false,
		timestamps: true,
		autoIndex: true,
	}
);

ProductSchema.index({ name: 1 }, { unique: true });

const conn = mongoose.createConnection(process.env.MONGO_URI);
module.exports = conn.model("product", ProductSchema);