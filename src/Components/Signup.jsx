import React, { useState } from 'react';
import { Mail, KeyRound,UserRound } from 'lucide-react';
import { validatePassword } from './authUtils';
import { api } from '../services/api';
import { setSignupData } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export function SignUp() {
  const [email, setEmail] = useState('');
  const [name,setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    dispatch(setSignupData({name,email,password}))
    try {
      await api.auth.sendOtp(email);
      navigate("/verify-email")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          
        </div>
        <form className="mt-8 space-y-6 " onSubmit={handleSignUp}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <div className="relative">
              <UserRound className="absolute inset-y-0 left-0 pt-1 pl-3 h-8 w-8 text-gray-400" />
              <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
                
                className="block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              
            </div>
            <div className="relative">
              <Mail className="absolute inset-y-0 left-0 pt-1 pl-3 h-8 w-8 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              
            </div>
            <div className="relative">
              <KeyRound className="absolute inset-y-0 left-0 pl-3 pt-1 h-8 w-8 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
