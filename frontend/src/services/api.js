const API_URL = import.meta.env.VITE_API_URL;

// GENERIC REQUEST
const request = async (endpoint, options = {}) => {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`,{
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Terjadi kesalahan"
        );
    }

    return data;
};

// AUTH
export const register = async (data) => {

    return request(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
};

export const login = async (data) => {
    return request(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
};

export const getMe = async () => {
    return request(
        "/auth/me"
    );
};

// COURSES
export const getCourses = async (
    params = ""
) => {
    return request(
        `/courses${params}`
    );
};

export const getCourse = async (id) => {
    return request(
        `/courses/${id}`
    );
};

export const createCourse = async (data) => {
    return request(
        "/courses",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
};

export const updateCourse = async (id, data) => {
    return request(
        `/courses/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );
};

export const deleteCourse = async (id) => {
    return request(
        `/courses/${id}`,
        {
            method: "DELETE"
        }
    );
};

// CATEGORY
export const getCategories = async () => {
    return request("/categories");
};

export const getCategory = async (id) => {
    return request(`/categories/${id}`);
};

export const createCategory = async (data) => {
    return request("/categories",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
};

export const updateCategory = async (id, data) => {
    return request(
        `/categories/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );
};

export const deleteCategory = async (id) => {
    return request(
        `/categories/${id}`,
        {
            method: "DELETE"
        }
    );
};