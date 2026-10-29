# LearnRec — System Architecture Overview

LearnRec is an enterprise, multi-tier personalized learning recommendation platform.

## High-Level Architecture

```
[ React SPA (Vite + Tailwind) ]  -- Port 5173
             |
             | HTTPS / JSON + Bearer JWT
             v
[ Spring Boot Core Backend ]     -- Port 8080
      |                  |
      | JPA / HikariCP   | Internal REST (X-Internal-Service-Key)
      v                  v
[ MySQL 8.0 DB ]   [ FastAPI AI Engine ] -- Port 8000
  (Port 3306)        (Scikit-learn, Pandas, NumPy)
```

## System Components

1. **Frontend (`frontend/`)**: React 18, Vite, Tailwind CSS, React Router v6, Axios.
2. **Core Backend (`backend/`)**: Java 17+, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Spring Security, Flyway, Maven.
3. **AI Recommendation Engine (`ai-service/`)**: Python 3.11+, FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy.
4. **Database & Migrations (`database/` & `backend/.../db/migration/`)**: MySQL 8.0, Flyway versioned migrations (`V1`, `V2`, `V3`).

## Seed Data & Domains

- **10 Master Categories**: AI, ML, Python, Java, C++, Data Science, DSA, Web Development, Databases, Cloud Computing.
- **100 Realistic Curated Resources**: 10 items per domain across Courses, Books, Tutorials, Coding Problems, and Resources.
- **Default Accounts**:
  - Admin: `admin@learnrec.com` / `Admin@123`
  - Demo User: `user@learnrec.com` / `User@123`
