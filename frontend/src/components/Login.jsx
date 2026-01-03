import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center px-4 ">
      <div className="w-full max-w-md border-white dark:bg-(--bg-primary) light:bg-(--bg-quaternary) rounded-2xl p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-comfortaa ">Welcome Back</h1>
          <p className="text-gray-500 font-space-grotesk mt-2">
            Please enter your details to sign in
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold font-space-grotesk ">
              Email Address
            </label>
            <input
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
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-space-grotesk"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 font-space-grotesk shadow-md shadow-blue-100 cursor-pointer">
            Sign In
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