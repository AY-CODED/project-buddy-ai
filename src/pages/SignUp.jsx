import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <p className="mb-4">Sign up form goes here.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;