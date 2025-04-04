// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmailPassword, signInWithGoogle } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Sign-Up with Email/Password
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const user = await signUpWithEmailPassword(name, email, password);
      console.log('Signed up:', user);
      toast.success('Signed up successfully! Redirecting to login...', {
        position: 'top-center',
        autoClose: 2000, // 2 seconds
        onClose: () => navigate('/login') // Redirect after toast closes
      });
    } catch (error) {
      toast.error('Error signing up: ' + error.message, {
        position: 'top-center',
        autoClose: 2000, // 5 seconds
      });
    };
  };

  // Handle Google Sign-Up
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('Google Signed up:', user);
      navigate('/home'); // Redirect after successful sign-up
    } catch (error) {
      alert('Error signing up with Google: ' + error.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#CCC2DC]">
      <div className="w-full flex justify-center">
        <div className="w-[450px] h-[560px] bg-[#FFFFFF1A] border-2 border-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
          <h2 className="text-center text-[#494059] text-xl font-bold">Create a New Account</h2>

          <form className="w-full" onSubmit={handleSignUp}>
            <div className="w-full mb-4">
              <label htmlFor="name" className="text-[#494059] text-sm mb-2 block">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full h-9 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="w-full mb-4">
              <label htmlFor="email" className="text-[#494059] text-sm mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                className="w-full h-9 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
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
                className="w-full h-9 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#9887C5] text-white font-bold rounded-md hover:bg-[#9F8AD1] focus:ring-2 focus:ring-purple-500"
            >
              Sign Up
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
            Sign up with Google
          </button>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <span className="text-[#494059] text-sm flex flex-row items-center justify-center gap-3">
              Already have an account?{' '}
              <div onClick={() => navigate('/login')} className="text-[#494059] font-bold hover:underline">
                Log in
              </div>
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
