import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteCourse, getCourse } from "../services/api";
import { useAuth } from "../context/useAuth";

const CourseDetail = () => {

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCourse = async () => {
            try {
                const response = await getCourse(id);

                if (isMounted) {
                    setCourse(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchCourse();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Yakin ingin menghapus kursus ini?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteCourse(id);
            navigate("/courses");
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <p>Loading...</p>
        );
    }

    if (!course) {
        return (
            <p>Course tidak ditemukan.</p>
        );
    }

    const isOwner =
        user &&
        user.role === "instructor" &&
        Number(user.id) ===
        Number(course.instructor.id);

    return (
        <div className="container">

            <div className="detail-card">
                <h1>{course.title}</h1>
                <p>{course.description}</p>

                <div className="detail-grid">
                    <div>
                        <strong>Rating</strong>
                        <p>⭐ {course.rating}</p>
                    </div>

                    <div>
                        <strong>Classification</strong>
                        <p>{course.rating_class}</p>
                    </div>

                    <div>
                        <strong>Level</strong>
                        <p>{course.level}</p>
                    </div>

                    <div>
                        <strong>Duration</strong>
                        <p>{course.duration}</p>
                    </div>

                    <div>
                        <strong>Instructor</strong>
                        <p>{course.instructor.name}</p>
                    </div>

                    <div>
                        <strong>Category</strong>
                        <p>{course.category.name}</p>
                    </div>

                </div>


                {isOwner && (
                    <div className="actions">

                        <Link to={`/courses/${course.id}/edit`} className="button">
                            Edit
                        </Link>

                        <button onClick={handleDelete} className="danger">
                            Delete
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};


export default CourseDetail;