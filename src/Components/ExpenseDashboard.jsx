import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(advancedFormat); // For custom date formats
dayjs.extend(isBetween); // For filtering dates

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function ExpenseDashboard({ expenses }) {
  const categoryData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => 
      dayjs().subtract(5 - i, 'month').startOf('month') // Get start of each month for the last 6 months
    );

    return last6Months.map(month => {
      const monthlyTotal = expenses
        .filter(expense => {
          const expenseDate = dayjs(expense.date);
          return expenseDate.isBetween(month, month.endOf('month'), null, '[]');
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        month: month.format('MMM YYYY'),
        amount: Number(monthlyTotal.toFixed(2))
      };
    });
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Expense Overview</h3>
        <p className="text-3xl font-bold text-indigo-600">
          ${totalSpent.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">Total Expenses</p>
      </div>

      <div className="space-y-6">
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Expenses by Category</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: $${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Monthly Expenses</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" name="Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
