// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailPassword, signInWithGoogle } from '../services/authService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Email/Password Login
  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailPassword(email, password);
      console.log('Logged in:', user);
      navigate('/home'); // Redirect after successful login
    } catch (error) {
      alert('Error logging in: ' + error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('Google Logged in:', user);
      navigate('/home'); // Redirect after successful login
    } catch (error) {
      alert('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#CCC2DC]">
      <div className="w-full flex justify-center">
        <div className="w-[450px] bg-[#FFFFFF1A] border-2 border-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
          <h2 className="text-center text-[#494059] text-xl font-bold">Login to Your Account</h2>

          <form className="w-full" onSubmit={handleLogIn}>
            {/* Email Field */}
            <div className="w-full mb-4">
              <label htmlFor="email" className="text-[#494059] text-sm mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                className="w-full h-12 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="w-full mb-4">
              <label htmlFor="password" className="text-[#494059] text-sm mb-2 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full h-12 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#9887C5] text-white font-bold rounded-md hover:bg-[#9F8AD1] focus:ring-2 focus:ring-purple-500"
            >
              Log In
            </button>
          </form>

          {/* Sign in with Google Button */}
          <button
            className="w-full h-12 border border-[#494059] rounded-md bg-white text-[#494059] font-bold flex items-center justify-center gap-2 hover:bg-gray-100"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
              alt="Google Icon"
              className="w-6 h-6"
            />
            Sign in with Google
          </button>

          {/* Signup Link */}
          <div className="mt-4 text-center">
            <span className="text-[#494059] text-sm flex flex-row items-center justify-center gap-3">
              Don’t have an account?{' '}
              <div onClick={() => navigate('/SignUp')} className="text-[#494059] font-bold cursor-pointer">
                Sign up
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
