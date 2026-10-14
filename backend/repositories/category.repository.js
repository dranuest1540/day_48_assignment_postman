import pool from "../config/database.js";

// GET ALL CATEGORIES
const getAllCategories = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            name,
            description
        FROM course_categories
        ORDER BY id ASC
        `
    );

    return rows;
};

// GET CATEGORY BY ID WITH COURSES
const getCategoryById = async (id) => {

    const [rows] = await pool.query(
        `
        SELECT
            cc.id AS category_id,
            cc.name AS category_name,
            cc.description AS category_description,

            c.id AS course_id,
            c.title AS course_title,
            c.rating AS course_rating,
            c.level AS course_level,
            c.duration AS course_duration,
            c.status AS course_status

        FROM course_categories cc

        LEFT JOIN courses c
            ON c.category_id = cc.id

        WHERE cc.id = ?

        ORDER BY c.id ASC
        `,
        [id]
    );

    if (rows.length === 0) {
        return null;
    }

    const category = {
        id: rows[0].category_id,
        name: rows[0].category_name,
        description: rows[0].category_description,
        courses: []
    };

    rows.forEach((row) => {

        if (row.course_id !== null) {

            category.courses.push({
                id: row.course_id,
                title: row.course_title,
                rating: Number(row.course_rating),
                level: row.course_level,
                duration: row.course_duration,
                status: row.course_status
            });
        }
    });

    return category;
};

// CREATE CATEGORY
const createCategory = async (name, description) => {

    const [result] = await pool.query(
        `
        INSERT INTO course_categories
        (
            name,
            description
        )

        VALUES (?, ?)
        `,
        [
            name,
            description
        ]
    );

    return result.insertId;
};

// UPDATE CATEGORY
const updateCategory = async (
    id,
    name,
    description
) => {

    const [result] = await pool.query(
        `
        UPDATE course_categories

        SET
            name = ?,
            description = ?

        WHERE id = ?
        `,
        [
            name,
            description,
            id
        ]
    );

    return result.affectedRows;
};

// CHECK COURSE
const countCoursesByCategory = async (id) => {

    const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM courses
        WHERE category_id = ?
        `,
        [id]
    );

    return Number(rows[0].total);
};

// DELETE CATEGORY
const deleteCategory = async (id) => {

    const [result] = await pool.query(
        `
        DELETE FROM course_categories
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows;
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    countCoursesByCategory,
    deleteCategory
};