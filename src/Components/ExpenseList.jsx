import React from "react";
import dayjs from "dayjs";
import { Edit2, Trash2 } from "lucide-react";

export function ExpenseList({ expenses, onEdit, onDelete }) {
  console.log("expenses", expenses);
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Expenses
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.description && expense.category
                      ? `${expense.category}`
                      : ""}
                    {expense.description
                      ? ` -${expense.description}`
                      : expense.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dayjs(expense.date).format("MMM D, YYYY")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {expenses.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No expenses recorded yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
