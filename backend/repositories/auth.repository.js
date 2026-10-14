import pool from "../config/database.js";

const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};

const createUser = async (
    name,
    email,
    password,
    role
) => {
    const [result] = await pool.query(
        `
        INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)
        `,
        [name, email, password, role]
    );

    return result.insertId;
};

export default {
    findUserByEmail,
    findUserById,
    createUser
};