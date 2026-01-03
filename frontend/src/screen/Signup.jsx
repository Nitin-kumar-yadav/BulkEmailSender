import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuthStore } from '../store/userAuthStore'
import toast from 'react-hot-toast'

const Signup = () => {
    const navigate = useNavigate();
    const { isSignup, signup } = useUserAuthStore();

    const [userData, setUserData] = useState({
        Name: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    })

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!userData.Name || !userData.Email || !userData.Password || !userData.ConfirmPassword) {
            toast.error('All fields are required');
            return;
        }
        if (userData.Password !== userData.ConfirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (userData.Password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const success = await signup(userData);

        if (success) {
            navigate('/verify-otp');
        }
    }

    return (
        <div className="h-[calc(100vh-5rem)] flex items-center justify-center px-4 ">
            <div className="w-full max-w-md border-white rounded-2xl p-8 shadow-lg dark:bg-(--bg-primary) light:bg-(--bg-quaternary)">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold font-comfortaa">Sign Up</h1>
                    <p className="text-gray-500 font-space-grotesk mt-2">
                        Create an account to get started
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSignup}>
                    {/* Name Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold font-space-grotesk">Name</label>
                        <input
                            value={userData.Name}
                            onChange={(e) => setUserData({ ...userData, Name: e.target.value })}
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold font-space-grotesk">Email Address</label>
                        <input
                            value={userData.Email}
                            onChange={(e) => setUserData({ ...userData, Email: e.target.value })}
                            type="email"
                            placeholder="hello@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold font-space-grotesk">Password</label>
                        <input
                            value={userData.Password}
                            onChange={(e) => setUserData({ ...userData, Password: e.target.value })}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold font-space-grotesk">Confirm Password</label>
                        <input
                            value={userData.ConfirmPassword}
                            onChange={(e) => setUserData({ ...userData, ConfirmPassword: e.target.value })}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <button
                        disabled={isSignup}
                        type="submit"
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 font-space-grotesk shadow-md ${isSignup ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isSignup ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Creating Account...
                            </span>
                        ) : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 font-space-grotesk">
                    Already have an account? {' '}
                    <Link to='/login' className="text-blue-600 font-bold cursor-pointer hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup