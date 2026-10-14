import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories } from "../services/api";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                const response = await getCategories();

                if (isMounted) {
                    setCategories(response.data);
                }
            } catch (error) {
                alert(error.message);
            }
        };

        void fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createCategory({ name, description });
            setName("");
            setDescription("");
            loadCategories();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus category?")) {
            return;
        }
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container">
            <h1>Categories</h1>
            <form className="form-card" onSubmit={handleSubmit}>
                <input placeholder="Nama category" value={name} onChange={(e) => setName(e.target.value)} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button>Tambah Category</button>
            </form>

            <div>
                {categories.map(
                    (category) => (
                        <div className="category-item" key={category.id}>
                            <div>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                            </div>

                            <button className="danger" onClick={() => handleDelete(category.id)}>
                                Delete
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Categories;