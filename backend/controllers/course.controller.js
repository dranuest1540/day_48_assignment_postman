import courseRepository from "../repositories/course.repository.js";

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseRepository.getAllCourses();

        res.status(200).json({
            success: true,
            message: "Data kursus berhasil diambil",
            data: courses
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getAllCourses
};