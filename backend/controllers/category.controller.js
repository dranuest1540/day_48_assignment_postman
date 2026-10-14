import categoryRepository from "../repositories/category.repository.js";

// GET ALL
const getAllCategories = async (req, res) => {

    try {

        const categories = await categoryRepository.getAllCategories();

        return res.status(200).json({
            success: true,
            message: "Data kategori berhasil diambil",
            data: categories
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// GET BY ID
const getCategoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await categoryRepository.getCategoryById(id);

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Detail kategori berhasil diambil",
            data: category
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// CREATE
const createCategory = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;

        const errors = {};

        // NAME
        if (!name) {

            errors.name = [
                "Name wajib diisi"
            ];

        } else if (typeof name !== "string") {

            errors.name = [
                "Name harus berupa string"
            ];

        } else if (name.length > 100) {

            errors.name = [
                "Name maksimal 100 karakter"
            ];
        }

        // DESCRIPTION
        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {

            errors.description = [
                "Description harus berupa string"
            ];
        }

        if (Object.keys(errors).length > 0) {

            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors
            });
        }

        const categoryId =
            await categoryRepository.createCategory(
                name.trim(),
                description
                    ? description.trim()
                    : null
            );

        const category =
            await categoryRepository.getCategoryById(
                categoryId
            );

        return res.status(201).json({
            success: true,
            message: "Kategori berhasil dibuat",
            data: category
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// UPDATE
const updateCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const existing =
            await categoryRepository.getCategoryById(id);

        if (!existing) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        const {
            name,
            description
        } = req.body;

        const errors = {};

        if (!name) {

            errors.name = [
                "Name wajib diisi"
            ];

        } else if (typeof name !== "string") {

            errors.name = [
                "Name harus berupa string"
            ];

        } else if (name.length > 100) {

            errors.name = [
                "Name maksimal 100 karakter"
            ];
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {

            errors.description = [
                "Description harus berupa string"
            ];
        }

        if (Object.keys(errors).length > 0) {

            return res.status(422).json({
                success: false,
                message: "Validasi gagal",
                errors
            });
        }

        await categoryRepository.updateCategory(
            id,
            name.trim(),
            description
                ? description.trim()
                : null
        );

        const updated =
            await categoryRepository.getCategoryById(id);

        return res.status(200).json({
            success: true,
            message: "Kategori berhasil diperbarui",
            data: updated
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

// DELETE
const deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const existing =
            await categoryRepository.getCategoryById(id);

        if (!existing) {

            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
        }

        const totalCourses =
            await categoryRepository
                .countCoursesByCategory(id);

        if (totalCourses > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "Kategori tidak dapat dihapus karena masih memiliki kursus"
            });
        }

        await categoryRepository.deleteCategory(id);

        return res.status(200).json({
            success: true,
            message: "Kategori berhasil dihapus",
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
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};