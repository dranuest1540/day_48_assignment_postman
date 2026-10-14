CREATE DATABASE IF NOT EXISTS lms_platform;

USE lms_platform;

-- ==========================================
-- TABLE USERS
-- ==========================================

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor', 'admin')
        NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLE COURSE CATEGORIES
-- ==========================================

CREATE TABLE course_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLE COURSES
-- ==========================================

CREATE TABLE courses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    instructor_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    thumbnail VARCHAR(255) NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration INT UNSIGNED NOT NULL,
    enrolled_count INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_courses_instructor
        FOREIGN KEY (instructor_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_courses_category
        FOREIGN KEY (category_id)
        REFERENCES course_categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ==========================================
-- TABLE ENROLLMENTS
-- ==========================================

CREATE TABLE enrollments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,
    course_id INT UNSIGNED NOT NULL,

    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM('active', 'completed', 'cancelled')
        NOT NULL DEFAULT 'active',

    CONSTRAINT fk_enrollments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT unique_user_course
        UNIQUE (user_id, course_id)
);

-- ==========================================
-- TABLE PRODUCTS (DAY 48 API ASSIGNMENT)
-- ==========================================

CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0.00,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ==========================================
-- INSERT USERS
-- ==========================================

INSERT INTO users (name, email, password, role) VALUES
('Danu Prastyo', 'danu@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'student'),
('Budi Santoso', 'budi@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'student'),
('Siti Aminah', 'siti@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'student'),
('Jane Instructor', 'jane@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'instructor'),
('Andi Developer', 'andi@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'instructor'),
('Admin LMS', 'admin@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'admin'),
('Santoso Uri', 'santoso@gmail.com', '$2b$10$awVK0z8j5r4giXxsV6OlAu1zVrCBBTxn7ArHeq/lxSQENbAAO1q9a', 'student');

-- ==========================================
-- INSERT CATEGORIES
-- ==========================================

INSERT INTO course_categories (name, description) VALUES
('Web Development',
 'Kursus mengenai pengembangan aplikasi web'),

('Database',
 'Kursus mengenai database dan SQL'),

('Frontend Development',
 'Kursus mengenai pengembangan antarmuka website'),

('Backend Development',
 'Kursus mengenai server dan REST API'),

('UI/UX Design',
 'Kursus mengenai desain antarmuka dan pengalaman pengguna');

-- ==========================================
-- INSERT COURSES
-- ==========================================

INSERT INTO courses
(instructor_id, category_id, title, description, rating,
 thumbnail, level, duration, enrolled_count, status)
VALUES

(4, 1,
 'Full-Stack Laravel React',
 'Build modern web applications using Laravel and React',
 8.9, 'laravel-react.jpg', 'intermediate', 1200, 156, 'published'),

(4, 4,
 'REST API with Node.js Express',
 'Learn how to build REST API using Node.js and Express',
 8.7, 'node-express.jpg', 'intermediate', 900, 124, 'published'),

(4, 2,
 'MySQL Database Fundamentals',
 'Learn database fundamentals and SQL queries using MySQL',
 8.5, 'mysql.jpg', 'beginner', 600, 210, 'published'),

(5, 3,
 'Modern JavaScript',
 'Learn modern JavaScript including ES6 and asynchronous programming',
 8.2, 'javascript.jpg', 'beginner', 750, 185, 'published'),

(5, 3,
 'React for Beginners',
 'Learn React fundamentals and build interactive web interfaces',
 8.8, 'react.jpg', 'beginner', 1000, 230, 'published'),

(5, 4,
 'Node.js Backend Development',
 'Learn backend development using Node.js',
 7.9, 'nodejs.jpg', 'intermediate', 1100, 98, 'published'),

(4, 1,
 'Laravel REST API',
 'Build RESTful APIs using Laravel framework',
 9.1, 'laravel-api.jpg', 'advanced', 1300, 275, 'published'),

(5, 2,
 'Advanced SQL Query',
 'Learn advanced SQL queries, joins, CTE and database optimization',
 8.4, 'advanced-sql.jpg', 'advanced', 850, 142, 'published'),

(4, 5,
 'UI/UX Design Fundamentals',
 'Learn basic principles of UI and UX design',
 7.5, 'uiux.jpg', 'beginner', 500, 88, 'published'),

(5, 1,
 'HTML CSS Fundamentals',
 'Learn the fundamentals of HTML and CSS for web development',
 6.8, 'html-css.jpg', 'beginner', 450, 320, 'published');

-- ==========================================
-- INSERT ENROLLMENTS
-- ==========================================

INSERT INTO enrollments (user_id, course_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(1, 7, 'completed'),

(2, 1, 'active'),
(2, 3, 'completed'),
(2, 5, 'active'),

(3, 4, 'active'),
(3, 5, 'active'),
(3, 9, 'completed');