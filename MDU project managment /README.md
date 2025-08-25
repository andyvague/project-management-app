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

### Phase 2: Integration & Automation
- [ ] Connect to existing CRM/database
- [ ] Document management system
- [ ] Automated notifications
- [ ] Reporting dashboard

### Phase 3: Advanced Features
- [ ] Mobile app
- [ ] API integrations
- [ ] Advanced analytics
- [ ] Multi-user permissions

## 🛠 Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: SQLite (development) / PostgreSQL (production)
- **UI Framework**: Material-UI for consistent design
- **State Management**: React Context + Hooks

## 📁 Project Structure

```
src/
├── components/     # React components
├── models/        # Data models and types
├── services/      # Business logic and API calls
├── utils/         # Helper functions
└── pages/         # Main application pages
```

## 🎯 What's Working Now

The system currently provides:

✅ **Dashboard Overview**
- Real-time statistics and metrics
- Project status distribution
- Recent activity tracking
- Progress visualization

✅ **Building Management**
- Add, view, and manage buildings
- Search and filter capabilities
- Status tracking and progress bars
- Geographic information management

✅ **Task Management**
- View all buildout tasks
- Filter by status, stage, and priority
- Task dependencies and assignments
- Due date tracking and overdue alerts

✅ **Sample Data**
- 5 sample buildings with realistic information
- 12 sample tasks across different stages
- Realistic project timelines and assignments

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

### Quick Start (Recommended)
```bash
# Make the setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Manual Setup
1. **Prerequisites**: Ensure you have Node.js 16+ installed
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Open your browser**: Navigate to http://localhost:3000

### Alternative Commands
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`

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

## 🤝 Contributing

This system is designed to evolve with Monkeybrains' needs. Key areas for enhancement:
- Integration with existing tools
- Mobile accessibility
- Advanced reporting
- Automation workflows
