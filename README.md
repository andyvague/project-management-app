# Project Management App

A modern, full-stack project management interface for teams. Built with React, Material UI, Node.js, Express, and PostgreSQL.

---

## 🚀 Features
- Project creation, editing, and management
- Task management (to-dos, deadlines, assignments)
- Team collaboration (comments, file uploads)
- User authentication (JWT-based)
- Responsive, modern UI (Material UI)
- Dockerized for easy development and deployment

---

## 🛠 Tech Stack
- **Frontend:** React, Material UI, React Router, React Query, Zustand
- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Authentication:** JWT, bcrypt
- **Monorepo:** Yarn workspaces
- **Containerization:** Docker, Docker Compose

---

## 📦 Project Structure
```
project-management-app/
├── backend/      # Express API server
├── frontend/     # React client app
├── docker-compose.yml
├── README.md
└── ...
```

---

## ⚡️ Quick Start

### Prerequisites
- Node.js >= 18.x
- Yarn >= 1.22.x
- Docker & Docker Compose

### Setup
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd project-management-app
   ```
2. **Install dependencies**
   ```bash
   yarn install
   ```
3. **Copy environment variables**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env as needed
   ```
4. **Start development environment**
   ```bash
   docker-compose up
   # or
   yarn dev
   ```
5. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🧩 Usage
- Register a new account or log in
- Create and manage projects
- Add, assign, and track tasks
- Collaborate with team members via comments
- Manage your profile and team

---

## 🗄 API Overview
- **Auth:** `/api/auth` (register, login, profile)
- **Projects:** `/api/projects` (CRUD, stats)
- **Tasks:** `/api/tasks` (CRUD, assignment)
- **Users:** `/api/users` (CRUD, search, stats)

See `/backend/src/routes/` for detailed endpoints.

---

## 🐳 Docker
- `docker-compose up` — Start all services
- `docker-compose down` — Stop all services

---

## 🧪 Testing
- Backend: `yarn workspace backend test`
- Frontend: `yarn workspace frontend test`

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License
MIT

---

## 🙋‍♂️ Support
For questions or support, open an issue in the repository. 