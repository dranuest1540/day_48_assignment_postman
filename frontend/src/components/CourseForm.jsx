import { useEffect, useState } from "react";
import { getCategories } from "../services/api";

const buildInitialForm = (initialData = null) => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    rating: initialData?.rating ?? "",
    category_id: initialData?.category?.id || initialData?.category_id || "",
    level: initialData?.level || "beginner",
    duration: initialData?.duration ?? "",
    thumbnail: initialData?.thumbnail || "",
    status: initialData?.status || "draft"
});

const CourseForm = ({ initialData, onSubmit, submitText = "Simpan" }) => {

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(() => buildInitialForm(initialData));

    useEffect(() => {
        getCategories()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleChange = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            ...form,
            rating: Number(form.rating),
            category_id: Number(form.category_id),
            duration: Number(form.duration)
        });
    };

    return (
        <form key={initialData?.id || "new-course"} className="form-card" onSubmit={handleSubmit}>
            
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} />
            
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
            
            <label>Rating</label>
            <input type="number" step="0.1" min="0" max="10" name="rating" value={form.rating} onChange={handleChange} />

            <label>Category</label>
            <select name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">Pilih Category</option>
                {categories.map(
                    (category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    )
                )}
            </select>

            <label>Level</label>

            <select name="level" value={form.level} onChange={handleChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>

            <label>Duration</label>
            <input type="number" min="1" name="duration" value={form.duration} onChange={handleChange} />

            <label>Thumbnail</label>

            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />

            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
            </select>

            <button type="submit">{submitText}</button>
        </form>
    );
};

export default CourseForm;