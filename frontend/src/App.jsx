import React, { useEffect } from "react";
import { applySavedTheme } from "./theme/theme";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./screen/Home";
import Login from "./screen/Login";
import Signup from "./screen/Signup";
import Dashboard from "./admin/Dashboard";
import Navbar from "./screen/Navbar";
import { Verification } from "./screen/Verification";
import { useUserAuthStore } from "./store/userAuthStore";
import Compose from "./admin/Compose";
import Settings from "./admin/Settings";

const GuestRoute = ({ children }) => {
    const { authUser, isCheckingAuth } = useUserAuthStore();
    if (isCheckingAuth) return null;
    return authUser ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
    const { authUser, isCheckingAuth } = useUserAuthStore();
    const location = useLocation();
    if (isCheckingAuth) return null;
    return authUser
        ? children
        : <Navigate to="/login" state={{ from: location }} replace />;
};

const App = () => {
    const { checkAuth, authUser, isCheckingAuth } = useUserAuthStore();

    useEffect(() => {
        applySavedTheme();
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "100vh", background: "#04060f",
            }}>
                <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderTopColor: "#6366f1",
                    animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Routes>

                {/*TODO: ── Public (guests only — logged-in users redirect to dashboard) ── */}
                <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                {/*TODO: ── OTP verification — open to everyone ── */}
                <Route path="/verify-otp" element={<Verification />} />

                {/*TODO: ── Protected (guests redirect to /login) ── */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/*TODO: ── Fallback ── */}
                <Route
                    path="*"
                    element={authUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
                />

            </Routes>
        </>
    );
};

export default App;