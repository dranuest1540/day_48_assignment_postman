import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


const Login = () => {

    const { login } = useAuth();

    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-page">

            <form className="form-card" onSubmit={handleSubmit}>
                <h1>Login</h1>

                {error && (
                    <div className="error">{error}</div>
                )}

                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>

                <p>
                    Belum punya akun?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </form>

        </div>
    );
};

export default Login;