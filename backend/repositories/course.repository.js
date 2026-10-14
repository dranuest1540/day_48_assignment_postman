import pool from "../config/database.js";

const getAllCourses = async () => {
    const [rows] = await pool.query(`
        SELECT
            c.id,
            c.title,
            c.description,
            c.rating,
            c.thumbnail,
            c.level,
            c.duration,
            c.enrolled_count,
            c.status,

            cc.id AS category_id,
            cc.name AS category_name,

            u.id AS instructor_id,
            u.name AS instructor_name

        FROM courses c

        INNER JOIN course_categories cc
            ON c.category_id = cc.id

        INNER JOIN users u
            ON c.instructor_id = u.id

        ORDER BY c.id ASC
    `);

    return rows;
};

export default {
    getAllCourses
};