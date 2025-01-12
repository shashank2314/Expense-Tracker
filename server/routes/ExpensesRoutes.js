const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/ExpensesControllers');
const {isAuthenticated} = require('../middlewares/AuthenticateToken');

router.post('/expenses', isAuthenticated, createExpense);
router.get('/expenses', isAuthenticated, getExpenses);
router.put('/expenses/:id', isAuthenticated, updateExpense);
router.delete('/expenses/:id', isAuthenticated, deleteExpense);

module.exports = router;
