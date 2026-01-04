import React, { useEffect } from 'react'
import { applySavedTheme } from './theme/theme';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import Signup from './screen/Signup';
import Dashboard from './admin/Dashboard';
import Navbar from './screen/Navbar';
import { Verification } from './screen/Verification';
import { useUserAuthStore } from './store/userAuthStore';

const App = () => {

    const { checkAuth, authUser, isCheckingAuth } = useUserAuthStore();


    useEffect(() => {
        applySavedTheme();
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {
                    authUser && !isCheckingAuth ? (
                        <Route path="/dashboard" element={<Dashboard />} />
                    ) : (
                        <Route path="/dashboard" element={<Navigate to="/login" />} />
                    )
                }
                <Route path="/verify-otp" element={<Verification />} />
            </Routes>
        </>
    )
}

export default App