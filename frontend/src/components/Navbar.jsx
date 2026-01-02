import { Link } from "react-router-dom";
import { toggleTheme } from "../theme/theme";

const Navbar = () => {

    return (
        <nav className="relative flex h-18 items-center justify-center overflow-hidden mt-2">
            <div className=" fixed top-3 z-50 mx-auto max-w-9xl rounded-4xl px-4 border-secondary/20 bg-secondary/30 backdrop-blur-xl shadow-2xl h-16">
                <div className="flex h-15 items-center justify-between">
                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className="nav-link font-comfortaa">Home</Link>
                        <Link to="/signup" className="nav-link font-comfortaa">Signup</Link>
                        <Link to="/login" className="nav-link font-comfortaa">Login</Link>
                        <Link to="/dashboard" className="nav-link font-comfortaa">Dashboard</Link>
                        <button className="nav-link font-comfortaa" onClick={toggleTheme}>Theme</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
