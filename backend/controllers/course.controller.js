import courseRepository from "../repositories/course.repository.js";

// RATING CLASSIFICATION
const getRatingClass = (rating) => {

    const value = Number(rating);

    if (value >= 8.5) {
        return "Top Rated";
    }

    if (value >= 7.0) {
        return "Recommended";
    }

    return "Regular";
};

// FORMAT COURSE RESPONSE
const formatCourse = (course) => {

    if (!course) {
        return null;
    }

    return {
        id: course.id,
        title: course.title,
        description: course.description,
        rating: Number(course.rating),
        rating_class: getRatingClass(course.rating),
        thumbnail: course.thumbnail,
        level: course.level,
        duration: course.duration,
        enrolled_count: course.enrolled_count,
        status: course.status,

        category: {
            id: course.category_id,
            name: course.category_name
        },

        instructor: {
            id: course.instructor_id,
            name: course.instructor_name
        }
    };
};

// GET ALL COURSES
const getAllCourses = async (req, res) => {

    try {

        const {
            search,
            category_id,
            level,
            sort_by,
            order
        } = req.query;

        const courses = await courseRepository.getAllCourses({
            search,
            category_id,
            level,
            sort_by,
            order
        });

        const formattedCourses = courses.map(formatCourse);

        return res.status(200).json({
            success: true,
            message: "Data kursus berhasil diambil",
            data: formattedCourses
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// GET COURSE BY ID
const getCourseById = async (req, res) => {

    try {

        const { id } = req.params;

        const course = await courseRepository.getCourseById(id);

        if (!course) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Detail kursus berhasil diambil",
            data: formatCourse(course)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// CREATE COURSE
const createCourse = async (req, res) => {

    try {

        const {
            title,
            description,
            rating,
            category_id,
            level,
            duration,
            thumbnail,
            status
        } = req.body;


        const errors = {};

        // TITLE
        if (!title) {

            errors.title = [
                "Title wajib diisi"
            ];

        } else if (typeof title !== "string") {

            errors.title = [
                "Title harus berupa string"
            ];

        } else if (title.length > 255) {

            errors.title = [
                "Title maksimal 255 karakter"
            ];
        }

        // DESCRIPTION
        if (!description) {

            errors.description = [
                "Description wajib diisi"
            ];

        } else if (typeof description !== "string") {

            errors.description = [
                "Description harus berupa string"
            ];
        }

        // RATING
        if (
            rating === undefined ||
            rating === null ||
            rating === ""
        ) {

            errors.rating = [
                "Rating wajib diisi"
            ];

        } else if (
            typeof Number(rating) !== "number" ||
            Number.isNaN(Number(rating))
        ) {

            errors.rating = [
                "Rating harus berupa angka"
            ];

        } else if (
            Number(rating) < 0 ||
            Number(rating) > 10
        ) {

            errors.rating = [
                "Rating harus antara 0 sampai 10"
            ];
        }

        // CATEGORY
        if (
            category_id === undefined ||
            category_id === null ||
            category_id === ""
        ) {

            errors.category_id = [
                "Category wajib diisi"
            ];

        } else if (
            !Number.isInteger(Number(category_id))
        ) {

            errors.category_id = [
                "Category ID harus berupa integer"
            ];
        }

        // LEVEL
        const allowedLevels = [
            "beginner",
            "intermediate",
            "advanced"
        ];

        if (!level) {

            errors.level = [
                "Level wajib diisi"
            ];

        } else if (!allowedLevels.includes(level)) {

            errors.level = [
                "Level hanya boleh beginner, intermediate, atau advanced"
            ];
        }

        // DURATION
        if (
            duration === undefined ||
            duration === null ||
            duration === ""
        ) {

            errors.duration = [
                "Duration wajib diisi"
            ];

        } else if (
            !Number.isInteger(Number(duration))
        ) {

            errors.duration = [
                "Duration harus berupa integer"
            ];

        } else if (
            Number(duration) < 1
        ) {

            errors.duration = [
                "Duration minimal 1"
            ];
        }

        // THUMBNAIL
        if (
            thumbnail !== undefined &&
            thumbnail !== null &&
            typeof thumbnail !== "string"
        ) {

            errors.thumbnail = [
                "Thumbnail harus berupa string"
            ];
        }

        // STATUS
        const allowedStatus = [
            "draft",
            "published"
        ];

        if (
            status !== undefined &&
            !allowedStatus.includes(status)
        ) {

            errors.status = [
                "Status hanya boleh draft atau published"
            ];
        }

        // VALIDATION RESULT
        if (Object.keys(errors).length > 0) {

            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors
            });
        }

        // CREATE
        const courseId = await courseRepository.createCourse({

            // ID instructor berasal dari JWT
            instructor_id: req.user.id,

            category_id: Number(category_id),

            title: title.trim(),

            description: description.trim(),

            rating: Number(rating),

            thumbnail: thumbnail || null,

            level,

            duration: Number(duration),

            enrolled_count: 0,

            status: status || "draft"
        });

        const newCourse =
            await courseRepository.getCourseById(courseId);

        return res.status(201).json({
            success: true,
            message: "Kursus berhasil dibuat",
            data: formatCourse(newCourse)
        });

    } catch (error) {

        console.error(error);

        // Foreign key category tidak ditemukan
        if (error.code === "ER_NO_REFERENCED_ROW_2") {

            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors: {
                    category_id: [
                        "Category tidak ditemukan"
                    ]
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {

    try {

        const { id } = req.params;

        const course =
            await courseRepository.getCourseById(id);

        // COURSE TIDAK ADA
        if (!course) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        // OWNERSHIP
        if (
            Number(course.instructor_id) !==
            Number(req.user.id)
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Anda tidak memiliki akses untuk mengubah data ini"
            });
        }

        const {
            title,
            description,
            rating,
            category_id,
            level,
            duration,
            thumbnail,
            status
        } = req.body;


        const errors = {};

        // TITLE
        if (!title) {

            errors.title = [
                "Title wajib diisi"
            ];

        } else if (typeof title !== "string") {

            errors.title = [
                "Title harus berupa string"
            ];

        } else if (title.length > 255) {

            errors.title = [
                "Title maksimal 255 karakter"
            ];
        }

        // DESCRIPTION
        if (!description) {

            errors.description = [
                "Description wajib diisi"
            ];

        } else if (typeof description !== "string") {

            errors.description = [
                "Description harus berupa string"
            ];
        }

        // RATING
        if (
            rating === undefined ||
            rating === null ||
            rating === ""
        ) {

            errors.rating = [
                "Rating wajib diisi"
            ];

        } else if (
            Number.isNaN(Number(rating))
        ) {

            errors.rating = [
                "Rating harus berupa angka"
            ];

        } else if (
            Number(rating) < 0 ||
            Number(rating) > 10
        ) {

            errors.rating = [
                "Rating harus antara 0 sampai 10"
            ];
        }

        // CATEGORY
        if (
            category_id === undefined ||
            category_id === null ||
            category_id === ""
        ) {

            errors.category_id = [
                "Category wajib diisi"
            ];

        } else if (
            !Number.isInteger(Number(category_id))
        ) {

            errors.category_id = [
                "Category ID harus berupa integer"
            ];
        }

        // LEVEL
        const allowedLevels = [
            "beginner",
            "intermediate",
            "advanced"
        ];

        if (!allowedLevels.includes(level)) {

            errors.level = [
                "Level tidak valid"
            ];
        }

        // DURATION
        if (
            !Number.isInteger(Number(duration)) ||
            Number(duration) < 1
        ) {

            errors.duration = [
                "Duration harus berupa integer minimal 1"
            ];
        }

        // THUMBNAIL
        if (
            thumbnail !== undefined &&
            thumbnail !== null &&
            typeof thumbnail !== "string"
        ) {

            errors.thumbnail = [
                "Thumbnail harus berupa string"
            ];
        }

        // STATUS
        const allowedStatus = [
            "draft",
            "published"
        ];

        if (!allowedStatus.includes(status)) {

            errors.status = [
                "Status hanya boleh draft atau published"
            ];
        }

        if (Object.keys(errors).length > 0) {

            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors
            });
        }

        await courseRepository.updateCourse(
            id,
            {
                category_id: Number(category_id),
                title: title.trim(),
                description: description.trim(),
                rating: Number(rating),
                thumbnail: thumbnail || null,
                level,
                duration: Number(duration),
                status
            }
        );

        const updatedCourse =
            await courseRepository.getCourseById(id);

        return res.status(200).json({
            success: true,
            message: "Kursus berhasil diperbarui",
            data: formatCourse(updatedCourse)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {

    try {

        const { id } = req.params;

        const course =
            await courseRepository.getCourseById(id);

        // NOT FOUND
        if (!course) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        // OWNERSHIP
        if (
            Number(course.instructor_id) !==
            Number(req.user.id)
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Anda tidak memiliki akses untuk mengubah data ini"
            });
        }

        await courseRepository.deleteCourse(id);

        return res.status(200).json({
            success: true,
            message: "Kursus berhasil dihapus",
            data: null
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};