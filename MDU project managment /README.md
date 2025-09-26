# MDU Project Management System

A comprehensive project management solution for **Monkeybrains.net** MDU (Multi-Dwelling Unit) buildout projects.

> **San Francisco-based ISP since 1998** - Bringing affordable, hassle-free internet service with incredible speed-to-cost ratio and quick installation.

## 🏗 System Architecture

### Core Data Structure
- **Buildings (MDUs)**: Highest-level container tied to physical addresses
- **Buildout Tasks**: Checklist/Kanban items for each buildout stage
- **Documents**: Permits, engineering drawings, approvals stored per building
- **Schedule**: Technician shifts and install dates linked to tasks

### Data Flow
```
Address → Building → Buildout Pipeline → Tasks → Documents → Schedule
```

## 🚀 Implementation Roadmap

### Phase 1: Core Foundation ✅
- [x] Data model definition
- [x] Basic web interface
- [x] Building management
- [x] Task pipeline structure
- [x] Dashboard with statistics
- [x] Sample data population
- [x] Responsive design
- [x] Dark mode support with theme switching

### Phase 2: Integration & Automation ✅
- [x] SQLite database with full CRUD API
- [x] RESTful API endpoints for all operations
- [x] Database persistence and data integrity
- [ ] Document management system
- [ ] Automated notifications
- [ ] Reporting dashboard

### Phase 3: Advanced Features
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-user permissions
- [ ] Production deployment

## 🛠 Tech Stack

- **Frontend**: React with TypeScript + Vite
- **Backend**: Node.js with Express + SQLite
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **UI Framework**: Material-UI for consistent design
- **State Management**: React Context + Hooks
- **API**: RESTful API with full CRUD operations

## 📁 Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── context/           # React Context providers
│   ├── pages/             # Main application pages
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── data/              # Sample data and loaders
├── backend/               # Node.js API server
│   ├── database/          # SQLite database and schema
│   ├── routes/            # API route handlers
│   └── scripts/           # Database seeding scripts
└── package.json           # Frontend dependencies
```

## 🎯 What's Working Now

The system currently provides:

✅ **Dashboard Overview**
- Real-time statistics and metrics
- Project status distribution
- Recent activity tracking
- Progress visualization

✅ **Building Management**
- Add, edit, and delete buildings with full CRUD operations
- Search and filter capabilities
- Status tracking and progress bars
- Geographic information management
- **Database persistence** - All changes saved to SQLite

✅ **Task Management**
- View all buildout tasks
- Filter by status, stage, and priority
- Task dependencies and assignments
- Due date tracking and overdue alerts

✅ **Database & API**
- SQLite database with full schema
- RESTful API endpoints for all operations
- Database seeding with 6 sample buildings
- Production-ready backend architecture
- Easy migration path to PostgreSQL

✅ **Dark Mode Support**
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes
- Professional appearance in both modes

✅ **Monkeybrains Branding**
- Company logo and tagline throughout the system
- Brand-specific color scheme (green primary, orange secondary)
- Professional footer with company details
- **Logo Integration Ready**: System automatically detects and uses your logo files

## 🎨 Logo Integration

✅ **Logo Successfully Integrated**: Your Monkeybrains logo is now displayed in the header and sidebar, giving the system a professional branded appearance.

## 🚀 Getting Started

### Quick Start (Full Stack)
```bash
# 1. Start the backend API server
cd backend
npm install
npm run seed  # Seed database with sample data
npm run dev   # Start API server on port 3001

# 2. Start the frontend (in a new terminal)
cd ..
npm install
npm run dev   # Start frontend on port 3000
```

### Manual Setup
1. **Prerequisites**: Ensure you have Node.js 16+ installed
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run seed  # Initialize database with sample data
   npm run dev   # Start API server
   ```
3. **Frontend Setup**:
   ```bash
   npm install
   npm run dev   # Start development server
   ```
4. **Open your browser**: Navigate to http://localhost:3000

### API Endpoints
- **Health Check**: http://localhost:3001/api/health
- **Buildings API**: http://localhost:3001/api/buildings
- **Database**: SQLite file at `backend/database/mdu.db`

### Development Commands
- **Frontend build**: `npm run build`
- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **Backend restart**: `cd backend && npm run dev`

## 📊 Data Models

### Building
```typescript
interface Building {
  id: string;
  address: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  buildoutStartDate: Date;
  estimatedCompletion: Date;
  tasks: BuildoutTask[];
  documents: Document[];
}
```

### BuildoutTask
```typescript
interface BuildoutTask {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  stage: 'pre-survey' | 'engineering' | 'permitting' | 'installation' | 'qa';
  assignedTo: string;
  dueDate: Date;
  dependencies: string[];
}
```

## 🔄 Workflow Stages

1. **Pre-Survey**: Site assessment and feasibility
2. **Engineering**: Design and planning
3. **Permitting**: Regulatory approvals
4. **Installation**: Physical buildout
5. **QA**: Quality assurance and testing
6. **Completion**: Handoff and documentation

## 📈 Success Metrics

- Project completion time
- Task completion rate
- Document compliance
- Resource utilization
- Customer satisfaction

## 🚀 Production Deployment

### Current Setup
- **Development**: SQLite database with hot reload
- **API Server**: Express.js on port 3001
- **Frontend**: Vite dev server on port 3000

### Production Ready
- **Database**: Easy migration to PostgreSQL
- **Backend**: PM2 process management ready
- **Frontend**: Static build for CDN deployment
- **API**: RESTful endpoints with error handling

### Deployment Steps
1. **Backend**: Copy `backend/` folder to server
2. **Database**: Run `npm run seed` to initialize
3. **Start**: `npm start` (or use PM2)
4. **Frontend**: Build and deploy static files

## 🤝 Contributing

This system is designed to evolve with Monkeybrains' needs. Key areas for enhancement:
- Document management system
- Mobile accessibility
- Advanced reporting
- Automation workflows
- Multi-user authentication
