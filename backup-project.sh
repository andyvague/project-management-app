#!/bin/bash

# Project Management App Backup Script
# This script creates a comprehensive backup of the project

echo "🔄 Creating backup of Project Management App..."

# Create backup directory with timestamp
BACKUP_DIR="project-management-app-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Creating backup directory: $BACKUP_DIR"

# Copy all project files
echo "📋 Copying project files..."
cp -r backend "$BACKUP_DIR/"
cp -r frontend "$BACKUP_DIR/"
cp docker-compose.yml "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp README.md "$BACKUP_DIR/"
cp project-plan.txt "$BACKUP_DIR/"

# Create a backup info file
cat > "$BACKUP_DIR/BACKUP-INFO.txt" << EOF
Project Management App Backup
============================

Backup Date: $(date)
Project Version: v1.0.0
Status: MVP Complete - Authentication Working

What's Included:
- Complete backend (Express + PostgreSQL + Sequelize)
- Complete frontend (React + Material UI + Vite)
- Docker configuration
- Database models and migrations
- Authentication system (JWT)
- Custom UI with dark mode
- All API endpoints

Current Features:
✅ User registration and login
✅ JWT authentication
✅ Dashboard with mock data
✅ Project and task CRUD APIs
✅ Beautiful UI with custom branding
✅ Dark/light mode toggle
✅ Responsive design
✅ Docker containerization

To restore:
1. Copy files to a new directory
2. Run: docker-compose up -d
3. Access at: http://localhost:3000

Database will be recreated automatically.
EOF

# Create a quick start script
cat > "$BACKUP_DIR/quick-start.sh" << 'EOF'
#!/bin/bash
echo "🚀 Starting Project Management App..."
echo "📦 Building and starting containers..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "✅ Project Management App is ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📝 Default test users:"
echo "   Email: admin@example.com, Password: admin123"
echo "   Email: user@example.com, Password: user123"
EOF

chmod +x "$BACKUP_DIR/quick-start.sh"

# Create a production build script
cat > "$BACKUP_DIR/build-production.sh" << 'EOF'
#!/bin/bash
echo "🏗️  Building for production..."

# Build frontend
cd frontend
npm run build

# Build backend (if needed)
cd ../backend
npm install --production

echo "✅ Production build complete!"
echo "📁 Frontend build: frontend/dist/"
echo "📁 Backend ready: backend/"
EOF

chmod +x "$BACKUP_DIR/build-production.sh"

# Create a compressed archive
echo "🗜️  Creating compressed archive..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

# Clean up temporary directory
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed successfully!"
echo "📦 Backup file: ${BACKUP_DIR}.tar.gz"
echo "📏 Backup size: $(du -h "${BACKUP_DIR}.tar.gz" | cut -f1)"
echo ""
echo "🎉 Your project is safely backed up!"
echo "💾 To restore: tar -xzf ${BACKUP_DIR}.tar.gz" 