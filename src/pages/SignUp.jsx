import React, { useState } from 'react';
import Doc2 from '../assets/Doc.gif';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Loader2, AlertCircle } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // 2. Prepare User Data
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const userData = {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: '',
        location: '',
        bio: '',
        createdAt: new Date().toISOString()
      };

      // 3. Save to Firestore
      // We use a try/catch specifically for the DB write so it doesn't block navigation
      try {
        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (dbError) {
        console.error("Firestore Error:", dbError);
        // We continue anyway so the user isn't stuck on the signup page
      }

      // 4. Navigate to dashboard
      navigate('/active-projects');

    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError(err.message || 'Failed to create an account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10'>
      <div className='bg-white shadow-xl rounded-lg flex flex-col lg:flex-row-reverse max-w-5xl w-full overflow-hidden'>
        
        <div className='lg:w-1/2 p-8 flex flex-col items-center justify-center bg-blue-50 relative'>
          <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
          <h2 className='text-3xl font-extrabold text-blue-800 mb-6 z-10 text-center'>Join Us!</h2>
          <img src={Doc2} alt="Welcome" className="w-48 h-48 object-contain mb-8 z-10" />
          <p className='text-blue-700 text-lg text-center leading-relaxed z-10 max-w-xs'>
            Create your account today and start managing your projects like a pro.
          </p>
        </div>

        <div className='lg:w-1/2 p-10 flex flex-col justify-center items-center text-center'>
          <div className='max-w-md w-full'>
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4'>Get Started</h1>
            <p className='text-gray-600 text-lg mb-8'>Create a free account to continue</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center text-sm text-left">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className='space-y-5' onSubmit={handleSubmit}>
              <input
                required
                type='text'
                placeholder='Full Name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                disabled={isLoading}
              />
              <input
                required
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                disabled={isLoading}
              />
              <input
                required
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                disabled={isLoading}
              />
              
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                 {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Creating Account...
                    </>
                ) : (
                    "Create Account"
                )}
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