import pool from "../config/database.js";

const getAllProducts = async () => {
    const [rows] = await pool.query(
        `
        SELECT id, name, description, price, stock, created_by, created_at, updated_at
        FROM products
        ORDER BY id ASC
        `
    );

    return rows;
};

const getProductById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT id, name, description, price, stock, created_by, created_at, updated_at
        FROM products
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};

const createProduct = async ({ name, description, price, stock, created_by }) => {
    const [result] = await pool.query(
        `
        INSERT INTO products (name, description, price, stock, created_by)
        VALUES (?, ?, ?, ?, ?)
        `,
        [name, description, price, stock, created_by]
    );

    return result.insertId;
};

const updateProduct = async (id, productData) => {
    const columns = {
        name: "name",
        description: "description",
        price: "price",
        stock: "stock"
    };
    const fields = Object.keys(productData).filter((field) => columns[field]);
    const assignments = fields.map((field) => `${columns[field]} = ?`).join(", ");
    const values = fields.map((field) => productData[field]);

    const [result] = await pool.query(
        `UPDATE products SET ${assignments} WHERE id = ?`,
        [...values, id]
    );

    return result.affectedRows;
};

const deleteProduct = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};