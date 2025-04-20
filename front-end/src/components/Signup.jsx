import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect authenticated users away from signup page
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading animation

    // Validate password match
    if (password !== verifyPassword) {
      setError('Passwords do not match');
      setIsLoading(false); // Revert to "Sign Up" button on validation failure
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5074/api/account/register',
        { username, password },
        { withCredentials: true }
      );
      setIsLoading(false); // Stop loading animation
      setIsRedirecting(true); // Show redirecting message
      setError(''); // Clear any previous errors

      // Wait 1 second to display redirecting message before navigating
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      setIsLoading(false); // Revert to "Sign Up" button on API failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
              disabled={isLoading || isRedirecting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
              disabled={isLoading || isRedirecting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="verifyPassword" className="block text-sm font-medium text-gray-700">
              Verify Password
            </label>
            <input
              type="password"
              id="verifyPassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
              disabled={isLoading || isRedirecting}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center transition-colors ${
              isLoading || isRedirecting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading || isRedirecting}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Signing up...
              </>
            ) : isRedirecting ? (
              'Redirecting to the login page...'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;