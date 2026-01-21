import React, { useState } from 'react'
import Doc2 from '../assets/Doc.gif'
// import { FcGoogle } from 'react-icons/fc';
// import { FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        await login(email, password);
        navigate('/active-projects');
    } catch (err) {
        console.error(err);
        setError('Failed to sign in. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10'>
      <div className='bg-white shadow-xl rounded-lg flex flex-col lg:flex-row max-w-5xl w-full overflow-hidden'>

        {/* Left Side: Illustration */}
        <div className='lg:w-1/2 p-8 flex flex-col items-center justify-center bg-blue-50 relative'>
          <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
          <h2 className='text-3xl font-extrabold text-blue-800 mb-6 z-10 text-center'>
            Hello There!
          </h2>
          <img
            src={Doc2}
            alt="Animated character welcoming"
            className="w-48 h-48 object-contain mb-8 z-10"
          />
          <p className='text-blue-700 text-lg text-center leading-relaxed z-10 max-w-xs'>
            Welcome to your AI-powered project companion. Sign in to unleash your productivity!
          </p>
        </div>

        {/* Right Side: Sign-In Form */}
        <div className='lg:w-1/2 p-10 flex flex-col justify-center items-center text-center'>
          <div className='max-w-md w-full'>
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4'>
              Welcome Back!
            </h1>
            <p className='text-gray-600 text-lg mb-8'>
              Sign in to continue to Project Buddy AI
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center text-sm text-left">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <input
                  required
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  required
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                  disabled={isLoading}
                />
              </div>
              
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out font-semibold text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Signing In...
                    </>
                ) : (
                    "Sign In"
                )}
              </button>

              <p className='mt-4 text-sm text-gray-500'>
                Don't have an account? <Link to='/signup' className='text-blue-600 hover:underline'>Sign Up</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}

export default SignIn
