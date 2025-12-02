import React from 'react';
import Doc2 from '../assets/Doc.gif';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to Sign In or Dashboard after successful validation
    navigate('/');
  };

  return (
    <section className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10'>
      <div className='bg-white shadow-xl rounded-lg flex flex-col lg:flex-row-reverse max-w-5xl w-full overflow-hidden'>

        {/* Right Side (on Desktop): Illustration */}
        <div className='lg:w-1/2 p-8 flex flex-col items-center justify-center bg-blue-50 relative'>
          <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
          <h2 className='text-3xl font-extrabold text-blue-800 mb-6 z-10 text-center'>
            Join Us!
          </h2>
          <img
            src={Doc2}
            alt="Animated character welcoming"
            className="w-48 h-48 object-contain mb-8 z-10"
          />
          <p className='text-blue-700 text-lg text-center leading-relaxed z-10 max-w-xs'>
            Create your account today and start managing your projects like a pro with AI assistance.
          </p>
        </div>

        {/* Left Side: Sign-Up Form */}
        <div className='lg:w-1/2 p-10 flex flex-col justify-center items-center text-center'>
          <div className='max-w-md w-full'>
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4'>
              Get Started
            </h1>
            <p className='text-gray-600 text-lg mb-8'>
              Create a free account to continue
            </p>

            {/* --- SOCIAL BUTTONS --- */}
            <div className='space-y-4 mb-8'>
              <button
                type="button"
                className='w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-300'
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Sign up with Google
              </button>

              <button
                type="button"
                className='w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300'
              >
                <FaFacebook className="w-5 h-5 mr-3 text-white" />
                Sign up with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* --- FORM --- */}
            <form className='space-y-5' onSubmit={handleSubmit}>
              <div>
                <input
                  required
                  type='text'
                  placeholder='Full Name'
                  className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                />
              </div>
              <div>
                <input
                  required
                  type='email'
                  placeholder='Email Address'
                  className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                />
              </div>
              <div>
                <input
                  required
                  type='password'
                  placeholder='Password'
                  className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                />
              </div>
              
              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out font-semibold text-lg'
              >
                Create Account
              </button>

              <p className='mt-4 text-sm text-gray-500'>
                Already have an account? <Link to='/' className='text-blue-600 hover:underline'>Sign In</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SignUp;