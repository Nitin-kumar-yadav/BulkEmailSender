import { Link } from "react-router-dom";
import { toggleTheme } from "../theme/theme";
import Checkbox from "../components/Checkbox";
import { useUserAuthStore } from "../store/userAuthStore";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { ImUser } from "react-icons/im";
import { CiLogout } from "react-icons/ci";

const Navbar = () => {

    const { authUser, isCheckingAuth, logout } = useUserAuthStore();

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }
    const handleLogout = async () => {
        await logout();
    }

    return (
        <>
            {!authUser ? (
                <nav className="relative flex h-18 items-center justify-center overflow-hidden mt-2">
                    <div className=" fixed top-3 z-50 mx-auto max-w-9xl rounded-4xl px-4 border-secondary/20 bg-secondary/30 backdrop-blur-xl shadow-2xl h-16">
                        <div className="flex h-15 items-center justify-between text-center gap-4">
                            <div className="hidden md:flex space-x-8">
                                <Link to="/" className="nav-link font-comfortaa">Home</Link>
                                <Link to="/login" className="nav-link font-comfortaa">Login</Link>
                                <Link to="/signup" className="nav-link font-comfortaa">Signup</Link>
                            </div>
                            <button onClick={toggleTheme}>
                                <Checkbox />
                            </button>
                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="relative inline-block items-start justify-self-start overflow-hidden">
                    <div className="fixed top-0 left-0 bottom-0 w-1/6 dark:bg-(--bg-primary) light:bg-(--bg-quaternary) rounded-xl">
                        <div className="m-2 mt-3 w-[90%] flex justify-start">
                            <ul className="flex flex-col gap-3 w-full h-auto " >
                                <li className="flex gap-2 w-full text-xl font-space-grotesk p-3 items-center border rounded-2xl hover:bg-(--bg-secondary) transition-all ease-in-out">
                                    <span><MdOutlineDashboard size={25} /></span><Link className="w-full" to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="flex gap-2 w-full text-xl font-space-grotesk p-3 items-center border rounded-2xl hover:bg-(--bg-secondary) transition-all ease-in-out">
                                    <span><HiOutlineMailOpen size={25} /></span><Link className="w-full" to={'/compose'} >Composed</Link>
                                </li>
                                <li className="flex gap-2 w-full text-xl font-space-grotesk p-3 items-center border rounded-2xl hover:bg-(--bg-secondary) transition-all ease-in-out">
                                    <span><FiSettings size={25} /></span><Link className="w-full" to={'/setting'} >Setting</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="fixed left-0 bottom-0 w-1/6  h-30 flex flex-col gap-2 p-3">
                            <div className="border h-[48%] w-full flex justify-start gap-3 items-start p-2 rounded-xl hover:bg-(--bg-secondary) transition-all ease-in-out">
                                <span><ImUser size={25} /></span>{authUser.Name}
                            </div>
                            <div className=" h-[48%] w-full ">
                                <button onClick={handleLogout} className="cursor-pointer border w-full flex justify-start gap-2 h-full p-2 rounded-xl hover:bg-[#261b2d] hover:text-red-500 transition-all ease-in-out"> <CiLogout size={25} /><span>Logout</span></button>
                            </div>
                        </div>
                    </div>
                </nav>
            )
            }
        </>

    );
};

export default Navbar;
