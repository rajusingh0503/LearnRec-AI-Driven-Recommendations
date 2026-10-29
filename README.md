# LearnRec — AI-Based Personalized Learning Recommendation System

LearnRec is a full-stack, distributed AI recommendation platform designed to help learners discover relevant educational content—including Courses, Books, Tutorials, Coding Problems, and Learning Resources—using Hybrid Machine Learning (Content-Based + Collaborative Filtering).

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios
- **Core Backend:** Java 17+, Spring Boot 3, Spring Data JPA, Hibernate, Spring Security, JWT, Maven
- **Database & Migrations:** MySQL 8.0, Flyway
- **AI Recommendation Engine:** Python 3.11+, FastAPI, Scikit-learn, Pandas, NumPy
- **Orchestration:** Docker & Docker Compose

---

## 📁 Project Structure

```
AI-Recommendation-System/
├── frontend/             # React + Vite Frontend
├── backend/              # Java Spring Boot 3 Core Backend
├── ai-service/           # Python FastAPI AI Recommendation Engine
├── database/             # Flyway Versioned SQL Migrations & Master Data
├── docs/                 # Architectural specifications and diagrams
├── docker-compose.yml    # Full-stack container orchestration
├── .gitignore            # Multi-stack gitignore
└── README.md             # Master documentation
```

---

## 🚀 Quick Start & Local Execution

### Prerequisites

- **Java JDK 17+** (with Apache Maven)
- **Node.js 18+ & npm**
- **Python 3.10+ & pip**
- **MySQL Server 8.0** running on localhost:3306

---

### 1. Database Setup

Ensure MySQL is running on port `3306`. Create the database if it doesn't already exist:
```sql
CREATE DATABASE IF NOT EXISTS learnrec_db;
```

> **Note:** Flyway migrations (`V1__init_schema.sql`, `V2__seed_initial_data.sql`, `V3__seed_sample_learning_contents.sql`) run automatically when the Spring Boot backend starts!

---

### 2. Run Python FastAPI AI Service

```bash
# Navigate to ai-service directory
cd ai-service

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Interactive OpenAPI Docs:** [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- **Health Check:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### 3. Run Java Spring Boot Backend

```bash
# Navigate to backend directory
cd backend

# Compile and package application
mvn clean compile

# Run Spring Boot application
mvn spring-boot:run
```
- **Backend Base URL:** [http://localhost:8080](http://localhost:8080)
- **Health Check:** [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)

---

### 4. Run React Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)

---

### 🐳 Running with Docker Compose

To start the entire platform (MySQL, AI Service, Spring Boot, React) simultaneously:
```bash
docker-compose up --build
```

---

## 🔑 Default Accounts (Seed Data)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@learnrec.com` | `Admin@123` |
| **User** | `user@learnrec.com` | `User@123` |

---

## 📊 Sample Catalog Coverage (100 Items)

The seeded catalog includes **10 items each across 10 high-impact technical domains**:
1. Artificial Intelligence
2. Machine Learning
3. Python Programming
4. Java Programming
5. C++ Programming
6. Data Science
7. Data Structures & Algorithms
8. Web Development
9. Databases & SQL
10. Cloud Computing

Each domain contains 2 Courses, 2 Books, 2 Tutorials, 2 Coding Problems, and 2 Learning Resources with tags, difficulty levels, and ratings.
