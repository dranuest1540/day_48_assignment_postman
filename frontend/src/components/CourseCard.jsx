import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
    const thumbnailUrl = course.thumbnail
        ? /^https?:\/\//i.test(course.thumbnail) || course.thumbnail.startsWith("/")
            ? course.thumbnail
            : `/images/${course.thumbnail}`
        : null;

    return (
        <div className="course-card">

            {thumbnailUrl && (
                <img src={thumbnailUrl} alt={course.title} />
            )}

            <div className="course-content">
                <span className="badge">{course.level}</span>

                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <p>
                    ⭐ {course.rating}
                    {" "}
                    <strong>{course.rating_class}</strong>
                </p>

                <p>
                    👨‍🏫{" "}
                    {course.instructor?.name}
                </p>

                <p>
                    👥{" "}
                    {course.enrolled_count}
                    {" "}students
                </p>

                <Link to={`/courses/${course.id}`} className="button">
                    Lihat Detail
                </Link>
            </div>
            
        </div>
    );
};

export default CourseCard;