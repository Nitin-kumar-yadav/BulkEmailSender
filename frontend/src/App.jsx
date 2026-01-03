import React, { useEffect } from 'react'
import { applySavedTheme } from './theme/theme';
import { Route, Routes } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import Signup from './screen/Signup';
import Dashboard from './admin/Dashboard';
import Navbar from './screen/Navbar';
import { Verification } from './screen/Verification';

const App = () => {
    useEffect(() => {
        applySavedTheme();
    }, []);
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verify-otp" element={<Verification />} />
            </Routes>
        </>
    )
}

export default App