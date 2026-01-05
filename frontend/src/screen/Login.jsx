import React, { useState } from 'react';
import { Link, Navigate, } from 'react-router-dom';
import { useUserAuthStore } from '../store/userAuthStore';

const Login = () => {
  const [userData, setUserData] = useState({
    Email: '',
    Password: '',
  });

  const { isLogin, login } = useUserAuthStore();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(userData);
      <Navigate to="/dashboard" />
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center px-4 ">
      <div className="w-full max-w-md border-white dark:bg-(--bg-primary) light:bg-(--bg-quaternary) rounded-2xl p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-comfortaa ">Welcome Back</h1>
          <p className="text-gray-500 font-space-grotesk mt-2">
            Please enter your details to sign in
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold font-space-grotesk ">
              Email Address
            </label>
            <input
              value={userData.Email}
              onChange={(e) => setUserData({ ...userData, Email: e.target.value })}
              type="email"
              placeholder="hello@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-space-grotesk"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold font-space-grotesk ">
              Password
            </label>
            <input
              value={userData.Password}
              onChange={(e) => setUserData({ ...userData, Password: e.target.value })}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-space-grotesk"
            />
          </div>

          <button
            disabled={isLogin}
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 font-space-grotesk shadow-md ${isLogin ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLogin ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Logging In...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-space-grotesk">
          Don't have an account? {' '}
          <Link to='/signup' className="text-blue-600 font-bold cursor-pointer hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;