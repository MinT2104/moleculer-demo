const mongoose = require("mongoose");
const env = require('dotenv')
env.config()

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

const AuthSchema = new mongoose.Schema(
	{
		id: { type: Number, required: true, unique: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true },
		address: { type: AddressSchema, required: true },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{
		versionKey: false,
		timestamps: true,
		autoIndex: true,
	}
);

AuthSchema.index({ email: 1 }, { unique: true });

const conn = mongoose.createConnection(process.env.MONGO_URI);
module.exports = conn.model("auth", AuthSchema);