import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseForm from "../components/CourseForm";
import { getCourse, updateCourse } from "../services/api";

const EditCourse = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        getCourse(id).then((response) => {
            setCourse(response.data);
        });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await updateCourse(id, form);
            navigate(`/courses/${id}`);
        } catch (error) {
            alert(error.message);
        }
    };

    if (!course) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <div className="container">
            <h1>Edit Course</h1>
            <CourseForm initialData={course} onSubmit={handleSubmit} submitText="Update Course" />
        </div>
    );
};

export default EditCourse;