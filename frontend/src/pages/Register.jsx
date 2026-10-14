import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: ""
        });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(form);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-page">

            <form className="form-card" onSubmit={handleSubmit}>
                <h1>Register</h1>
                {error && (
                    <div className="error">{error}</div>
                )}
                <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} autoComplete="name" maxLength={100} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="email" maxLength={150} required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} autoComplete="new-password" minLength={8} required />
                <button type="submit">Register</button>
                <p>
                    Sudah punya akun?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>

        </div>
    );
};


export default Register;