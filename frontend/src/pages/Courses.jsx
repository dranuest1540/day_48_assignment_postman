import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/api";

const Courses = () => {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [order, setOrder] = useState("desc");
    const loadCourses = async () => {
        try {

            const params = new URLSearchParams();

            if (search) {
                params.set("search", search);
            }

            if (level) {
                params.set("level", level);
            }

            if (sortBy) {
                params.set("sort_by", sortBy);
                params.set("order", order);
            }

            const query = params.toString() ? `?${params.toString()}` : "";
            const response = await getCourses(query);
            setCourses(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        let cancelled = false;

        const fetchInitialCourses = async () => {
            try {
                const response = await getCourses();
                if (!cancelled) {
                    setCourses(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        fetchInitialCourses();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        loadCourses();
    };

    return (
        <div className="container">

            <h1>Semua Courses</h1>

            <form className="filters" onSubmit={handleSearch}>
                <input placeholder="Cari kursus..." value={search} onChange={(e) => setSearch(e.target.value)} />
                
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="">Semua Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Default</option>
                    <option value="rating">Rating</option>
                    <option value="enrolled_count">Popular</option>
                    <option value="duration">Duration</option>
                </select>

                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>

                <button>Cari</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="course-grid">
                    {courses.map(
                        (course) => (
                            <CourseCard key={course.id} course={course} />
                        )
                    )}
                </div>
            )}

        </div>
    );
};

export default Courses;