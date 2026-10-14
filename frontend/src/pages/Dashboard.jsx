import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {

    const { user } = useAuth();

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <div className="dashboard-card">
                <h2>Selamat datang,{" "}{user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>

                {user.role === "instructor" && (
                    <Link to="/courses/create" className="button">
                        Buat Course
                    </Link>
                )}
            </div>
        </div>
    );
};


export default Dashboard;