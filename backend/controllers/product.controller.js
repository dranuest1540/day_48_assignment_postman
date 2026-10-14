import productRepository from "../repositories/product.repository.js";

const formatProduct = (product) => ({
    ...product,
    price: Number(product.price)
});

const isNumericInput = (value) =>
    (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) &&
    Number.isFinite(Number(value));

const validateProduct = (body, { partial = false } = {}) => {
    const errors = {};
    const fields = ["name", "description", "price", "stock"];
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { body: ["Request body harus berupa objek JSON"] };
    }

    const hasField = (field) => Object.hasOwn(body, field);

    if ((!partial || hasField("name")) && (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 150)) {
        errors.name = ["Name wajib diisi dan maksimal 150 karakter"];
    }

    if (hasField("description") && typeof body.description !== "string") {
        errors.description = ["Description harus berupa string"];
    }

    if ((!partial || hasField("price")) && (!isNumericInput(body.price) || Number(body.price) < 0)) {
        errors.price = ["Price wajib berupa angka nol atau lebih"];
    }

    if (hasField("stock") && (!isNumericInput(body.stock) || !Number.isInteger(Number(body.stock)) || Number(body.stock) < 0)) {
        errors.stock = ["Stock harus berupa bilangan bulat nol atau lebih"];
    }

    if (partial && !fields.some(hasField)) {
        errors.body = ["Setidaknya satu field product harus diubah"];
    }

    return errors;
};

const parseId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const createProductController = (repository = productRepository) => {
    const getAllProducts = async (req, res) => {
        try {
            const products = await repository.getAllProducts();
            return res.status(200).json({
                success: true,
                message: "Data product berhasil diambil",
                data: products.map(formatProduct)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }
    };

    const getProductById = async (req, res) => {
        try {
            const id = parseId(req.params.id);
            const product = id ? await repository.getProductById(id) : null;
            if (!product) {
                return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
            }
            return res.status(200).json({ success: true, message: "Product berhasil diambil", data: formatProduct(product) });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }
    };

    const createProduct = async (req, res) => {
        try {
            const errors = validateProduct(req.body);
            if (Object.keys(errors).length) {
                return res.status(422).json({ success: false, message: "Validasi gagal", errors });
            }

            const productId = await repository.createProduct({
                name: req.body.name.trim(),
                description: req.body.description?.trim() ?? "",
                price: Number(req.body.price),
                stock: req.body.stock === undefined ? 0 : Number(req.body.stock),
                created_by: req.user.id
            });
            const product = await repository.getProductById(productId);
            return res.status(201).json({ success: true, message: "Product berhasil dibuat", data: formatProduct(product) });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }
    };

    const updateProduct = (partial) => async (req, res) => {
        try {
            const id = parseId(req.params.id);
            const existingProduct = id ? await repository.getProductById(id) : null;
            if (!existingProduct) {
                return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
            }

            const errors = validateProduct(req.body, { partial });
            if (Object.keys(errors).length) {
                return res.status(422).json({ success: false, message: "Validasi gagal", errors });
            }

            const productData = {};
            for (const field of ["name", "description", "price", "stock"]) {
                if (!Object.hasOwn(req.body, field)) continue;
                productData[field] = field === "name" || field === "description"
                    ? req.body[field].trim()
                    : Number(req.body[field]);
            }
            if (!partial) {
                productData.description ??= "";
                productData.stock ??= 0;
            }

            await repository.updateProduct(id, productData);
            const product = await repository.getProductById(id);
            return res.status(200).json({ success: true, message: "Product berhasil diperbarui", data: formatProduct(product) });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }
    };

    const deleteProduct = async (req, res) => {
        try {
            const id = parseId(req.params.id);
            const product = id ? await repository.getProductById(id) : null;
            if (!product) {
                return res.status(404).json({ success: false, message: "Product tidak ditemukan" });
            }
            await repository.deleteProduct(id);
            return res.status(200).json({ success: true, message: "Product berhasil dihapus", data: product.id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
        }
    };

    return { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
};

export default createProductController();