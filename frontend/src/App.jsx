import React, { useEffect } from "react";
import { applySavedTheme } from "./theme/theme";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import Login from "./screen/Login";
import Signup from "./screen/Signup";
import Dashboard from "./admin/Dashboard";
import Navbar from "./screen/Navbar";
import { Verification } from "./screen/Verification";
import { useUserAuthStore } from "./store/userAuthStore";

const App = () => {
    const { checkAuth, authUser, isCheckingAuth } = useUserAuthStore();

    useEffect(() => {
        applySavedTheme();
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />


                <Route
                    path="/login"
                    element={!authUser ? <Login /> : <Navigate to="/dashboard" />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <Signup /> : <Navigate to="/dashboard" />}
                />
                <Route path="/verify-otp" element={<Verification />} />
                <Route
                    path="/dashboard"
                    element={authUser ? <Dashboard /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
};

export default App;
