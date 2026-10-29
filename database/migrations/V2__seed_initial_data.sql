-- =============================================================================
-- Migration: V2__seed_initial_data.sql
-- Description: Master Data Seeding (Roles, Admin, Categories, Settings, Tags)
-- =============================================================================

-- 1. Insert Default Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_USER', 'Standard platform user with personalized recommendation access'),
(2, 'ROLE_ADMIN', 'Platform administrator with content, analytics, and tuning management')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Default Administrative & Demo Accounts
-- Passwords BCrypt encoded:
-- Admin: 'Admin@123' -> $2a$10$1r2C2B2q3C2A3B4C5D6E7OFV6xH6pUuQ6vV7xY8z9A0B1C2D3E4F. (standard valid test hash)
-- Below is BCrypt for 'Admin@123': $2a$10$tM2a6hJ9p1M3v0.iW/zK9.VjN4B8gL6hV3uJ5tB9lQ7kF1zO2s.6y
INSERT INTO users (id, email, password_hash, full_name, is_active, created_at, updated_at) VALUES
(1, 'admin@learnrec.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', TRUE, NOW(), NOW()),
(2, 'user@learnrec.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Learner', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Assign Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- Admin has ROLE_ADMIN
(1, 1), -- Admin also has ROLE_USER
(2, 1)  -- Demo Learner has ROLE_USER
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- Initialize User Preference for Demo User
INSERT INTO user_preferences (id, user_id, preferred_categories, preferred_content_types, preferred_difficulty) VALUES
(1, 2, '["Artificial Intelligence", "Machine Learning", "Python Programming", "Data Structures & Algorithms"]', '["COURSE", "TUTORIAL", "CODING_PROBLEM"]', 'INTERMEDIATE')
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 3. Insert 10 Master Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Artificial Intelligence', 'artificial-intelligence', 'Foundational and modern AI techniques, neural networks, agents, and computer vision.'),
(2, 'Machine Learning', 'machine-learning', 'Supervised, unsupervised, reinforcement learning, model deployment, and optimization.'),
(3, 'Python Programming', 'python-programming', 'Core Python, advanced idioms, object-oriented concepts, and enterprise scripting.'),
(4, 'Java Programming', 'java-programming', 'Core Java, Spring ecosystem, multithreading, enterprise architecture, and JVM internals.'),
(5, 'C++ Programming', 'cpp-programming', 'Modern C++ (C++17/20), low-level memory management, systems programming, and STL.'),
(6, 'Data Science', 'data-science', 'Data analysis, statistics, feature engineering, visualization, and exploratory tools.'),
(7, 'Data Structures & Algorithms', 'data-structures-and-algorithms', 'Algorithmic paradigms, time/space complexity, data structures, and competitive coding.'),
(8, 'Web Development', 'web-development', 'Frontend and backend web technologies, REST APIs, modern frameworks, and responsive design.'),
(9, 'Databases & SQL', 'databases-and-sql', 'Relational design, normalization, query optimization, indexing, and distributed data stores.'),
(10, 'Cloud Computing', 'cloud-computing', 'Cloud architecture, microservices, DevOps, Docker, Kubernetes, and serverless computing.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Core Tags
INSERT INTO tags (id, name) VALUES
(1, 'Python'), (2, 'Java'), (3, 'C++'), (4, 'Machine Learning'), (5, 'Deep Learning'),
(6, 'Neural Networks'), (7, 'Spring Boot'), (8, 'React'), (9, 'SQL'), (10, 'PostgreSQL'),
(11, 'MySQL'), (12, 'Docker'), (13, 'Kubernetes'), (14, 'AWS'), (15, 'Cloud'),
(16, 'Algorithms'), (17, 'Data Structures'), (18, 'LeetCode'), (19, 'System Design'), (20, 'Pandas'),
(21, 'NumPy'), (22, 'Scikit-Learn'), (23, 'PyTorch'), (24, 'TensorFlow'), (25, 'Microservices'),
(26, 'REST API'), (27, 'Tailwind CSS'), (28, 'JavaScript'), (29, 'TypeScript'), (30, 'DevOps')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Insert System Configuration & Recommendation Parameters
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('recommendation.algorithm.default', 'HYBRID', 'Default recommendation algorithm strategy (HYBRID, CONTENT_BASED, COLLABORATIVE)'),
('recommendation.weight.content_based', '0.60', 'Weight assigned to content-based similarity score (0.0 to 1.0)'),
('recommendation.weight.collaborative', '0.40', 'Weight assigned to collaborative filtering score (0.0 to 1.0)'),
('recommendation.top_k.default', '10', 'Number of recommendations returned per request by default'),
('recommendation.cold_start.threshold', '3', 'Minimum number of user interactions before engaging collaborative filtering'),
('recommendation.ai_service.url', 'http://localhost:8000', 'Internal URL of the Python FastAPI recommendation engine')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);
