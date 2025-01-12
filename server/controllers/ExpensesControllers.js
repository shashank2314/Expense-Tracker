const mongoose = require('mongoose'); // For ObjectId validation
const Expense = require('../models/Expense.js');

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const { category, amount, date } = req.body;

    // Validate request body
    if (!category || !amount || !date) {
      return res.status(400).json({ success: false, message: 'Category, amount, and date are required' });
      
    }
    // Create expense
    const expense = await Expense.create({
      ...req.body,
      userId: req.id,
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ success: false, message: 'Failed to create expense. Please try again later.' });
  }
};

// Get all expenses for the authenticated user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.id }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({ success: false, message: 'No expenses found for this user' });
    }

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenses. Please try again later.' });
  }
};

// Update an expense by ID
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID format' });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.id },
      req.body,
      { new: true, runValidators: true } // runValidators ensures fields follow schema rules
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ success: false, message: 'Failed to update expense. Please try again later.' });
  }
};

// Delete an expense by ID
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID format' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ success: false, message: 'Failed to delete expense. Please try again later.' });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
