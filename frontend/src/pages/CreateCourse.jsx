import { useNavigate } from "react-router-dom";
import CourseForm from "../components/CourseForm";
import { createCourse } from "../services/api";

const CreateCourse = () => {

    const navigate = useNavigate();
    const handleSubmit = async (form) => {
        try {
            const response = await createCourse(form);
            navigate(`/courses/${response.data.id}`);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container">
            <h1>Create Course</h1>
            <CourseForm onSubmit={handleSubmit} submitText="Create Course" />
        </div>
    );
};

export default CreateCourse;