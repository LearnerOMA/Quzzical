import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgetPass() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#CCC2DC]">
      <div className="w-full flex justify-center">
        <div className="w-[450px] bg-[#FFFFFF1A] border-2 border-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
          <h2 className="text-center text-[#494059] text-xl font-bold">Reset Your Password</h2>

          {/* Email Field */}
          <div className="w-full">
            <label htmlFor="email" className="text-[#494059] text-sm mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full h-12 border border-white rounded-md bg-white opacity-90 pl-2 text-sm"
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#9887C5] text-white font-bold rounded-md hover:bg-[#9F8AD1] focus:ring-2 focus:ring-purple-500"
          >
            Send Reset Link
          </button>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <span className="text-[#494059] text-sm flex flex-row items-center justify-center gap-3">
              Remember your password?{' '}
              <div onClick={() => navigate('/login')} className="text-[#494059] font-bold hover:underline">
                Log in
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
