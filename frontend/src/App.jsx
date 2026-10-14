import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import Categories from "./pages/Categories";

const App = () => {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Courses />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/courses/create" element={
                    <ProtectedRoute>
                        <CreateCourse />
                    </ProtectedRoute>
                } />
                <Route path="/courses/:id/edit" element={
                    <ProtectedRoute>
                        <EditCourse />
                    </ProtectedRoute>
                } />
                <Route path="/categories" element={
                    <ProtectedRoute>
                        <Categories />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
};

export default App;