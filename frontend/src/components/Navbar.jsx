import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {

    const { user, logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div>
                <Link to="/" className="logo">
                    LMS Platform
                </Link>
            </div>

            <div className="nav-links">
                <Link to="/courses">
                    Courses
                </Link>

                {user && (
                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                )}

                {user?.role === "instructor" && (
                    <Link to="/courses/create">
                        Create Course
                    </Link>
                )}

                {user?.role === "admin" && (
                    <Link to="/categories">
                        Categories
                    </Link>
                )}

                {user ? (
                    <>
                        <span>{user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;