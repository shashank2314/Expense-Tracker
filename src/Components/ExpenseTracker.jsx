import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast
import { api } from '../services/api';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { ExpenseDashboard } from './ExpenseDashboard';
import { LogOut, Plus } from 'lucide-react';

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);
  

  const fetchExpenses = async () => {
    try {
      const data = await api.expenses.getAll();
      if (data.success) {
        const newExpenses = data.expenses.slice();
        setExpenses(newExpenses);
      } 
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSignOut = async() => {
    const res = await api.auth.logout();
    if(res.success){
      sessionStorage.removeItem("accessToken");
      toast.info('Signed out successfully.');
    }
    window.location.reload();
  };

  const handleAddExpense = async (expense) => {
    try {
      const res = await api.expenses.create(expense);
      if (res.success) {
        fetchExpenses();
        setShowForm(false);
        toast.success('Expense added successfully!');
      } else {
        toast.error(res.message || 'Failed to add expense.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Server error while adding expense.');
    }
  };

  const handleUpdateExpense = async (id, updates) => {
    try {
      const res = await api.expenses.update(id, updates);
      if (res.success) {
        fetchExpenses();
        setEditingExpense(null);
        setShowForm(false);
        toast.success('Expense updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update expense.');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Server error while updating expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await api.expenses.delete(id);
      if (res.success) {
        setExpenses([]);
        fetchExpenses();
        
        toast.success('Expense deleted successfully!');
      } else {
        toast.error(res.message || 'Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Server error while deleting expense.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          onSubmit={editingExpense
            ? (data) => handleUpdateExpense(editingExpense._id, data)
            : (data) => handleAddExpense(data)}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          initialData={editingExpense}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseDashboard expenses={expenses} />
        <ExpenseList
          expenses={expenses}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setShowForm(true);
          }}
          onDelete={handleDeleteExpense}
        />
      </div>
    </div>
  );
}
