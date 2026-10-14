import { useEffect, useState } from "react";
import { AuthContext } from "./authContextValue";
import { login as loginAPI, getMe } from "../services/api";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => {
        return !!localStorage.getItem("token");
    });

    // CHECK LOGIN
    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        getMe()
            .then((response) => {
                setUser(response.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // LOGIN
    const login = async (email, password) => {

        const response = await loginAPI({ email, password});
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        return response;
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
