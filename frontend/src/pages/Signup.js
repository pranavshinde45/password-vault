import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Use context

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth(); // ✅ Global hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = await signup(email, password);
    if (!result.success) {
      setError(result.error);
    }
    // ✅ No useEffect—App guard auto-redirects
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
          Sign Up
        </button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;