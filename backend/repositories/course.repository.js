import pool from "../config/database.js";

// GET ALL COURSES
const getAllCourses = async (filters = {}) => {
    let sql = `
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

        WHERE 1 = 1
    `;

    const params = [];

    // SEARCH
    if (filters.search) {
        sql += ` AND c.title LIKE ?`;
        params.push(`%${filters.search}%`);
    }

    // FILTER CATEGORY
    if (filters.category_id) {
        sql += ` AND c.category_id = ?`;
        params.push(filters.category_id);
    }

    // FILTER LEVEL
    if (filters.level) {
        sql += ` AND c.level = ?`;
        params.push(filters.level);
    }

    // SORTING
    const allowedSort = [
        "rating",
        "enrolled_count",
        "duration"
    ];

    const sortBy = allowedSort.includes(filters.sort_by)
        ? filters.sort_by
        : "id";

    const order =
        filters.order?.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    sql += ` ORDER BY c.${sortBy} ${order}`;

    const [rows] = await pool.query(sql, params);

    return rows;
};


// GET COURSE BY ID
const getCourseById = async (id) => {

    const [rows] = await pool.query(
        `
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

        WHERE c.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};


// CREATE COURSE
const createCourse = async (courseData) => {

    const {
        instructor_id,
        category_id,
        title,
        description,
        rating,
        thumbnail,
        level,
        duration,
        enrolled_count,
        status
    } = courseData;

    const [result] = await pool.query(
        `
        INSERT INTO courses
        (
            instructor_id,
            category_id,
            title,
            description,
            rating,
            thumbnail,
            level,
            duration,
            enrolled_count,
            status
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            instructor_id,
            category_id,
            title,
            description,
            rating,
            thumbnail,
            level,
            duration,
            enrolled_count,
            status
        ]
    );

    return result.insertId;
};

// UPDATE COURSE
const updateCourse = async (id, courseData) => {

    const {
        category_id,
        title,
        description,
        rating,
        thumbnail,
        level,
        duration,
        status
    } = courseData;

    const [result] = await pool.query(
        `
        UPDATE courses

        SET
            category_id = ?,
            title = ?,
            description = ?,
            rating = ?,
            thumbnail = ?,
            level = ?,
            duration = ?,
            status = ?

        WHERE id = ?
        `,
        [
            category_id,
            title,
            description,
            rating,
            thumbnail,
            level,
            duration,
            status,
            id
        ]
    );

    return result.affectedRows;
};

// DELETE COURSE
const deleteCourse = async (id) => {

    const [result] = await pool.query(
        `
        DELETE FROM courses
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows;
};

// EXPORT
export default {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};