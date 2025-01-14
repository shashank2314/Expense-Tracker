const mongoose = require("mongoose")

const refreshTokenSchema = new mongoose.Schema({
    refreshToken:{type:String,required:true},
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 10 * 24 * 60 * 60, // The document will be automatically deleted after 10 days of its creation time
	},
},{timestamps:true});
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);