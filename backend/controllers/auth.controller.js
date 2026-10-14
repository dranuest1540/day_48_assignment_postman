import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import authRepository from "../repositories/auth.repository.js";

export const createAuthController = (repository = authRepository) => {
const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const normalizedName = typeof name === "string" ? name.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        const errors = {};

        if (!normalizedName || normalizedName.length > 100) {
            errors.name = ["Name wajib diisi"];
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 150) {
            errors.email = ["Email tidak valid"];
        }

        if (typeof password !== "string" || password.length < 8) {
            errors.password = ["Password minimal 8 karakter"];
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors
            });
        }

        const existingUser = await repository.findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email sudah digunakan"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await repository.createUser(
            normalizedName,
            normalizedEmail,
            hashedPassword,
            "student"
        );

        const user = await repository.findUserById(userId);

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            return res.status(422).json({
                success: false,
                message: "Email dan password wajib diisi"
            });
        }

        const user = await repository.findUserByEmail(email.trim().toLowerCase());

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const me = async (req, res) => {
    try {
        const user =
            await repository.findUserById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data user berhasil diambil",
            data: user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

return {
    register,
    login,
    me
};
};

export default createAuthController();