const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: {type:String},
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
},{timestamps:true});

module.exports = mongoose.model("Expense", expenseSchema);