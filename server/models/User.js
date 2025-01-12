const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken:[{type:mongoose.Schema.Types.ObjectId,ref:'RefreshToken'}],
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);