#!/bin/bash

# Quick Project Save Script
echo "💾 Saving Project Management App..."

# Create timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directory
BACKUP_DIR="saves/project-save-${TIMESTAMP}"
mkdir -p saves
mkdir -p "$BACKUP_DIR"

echo "📁 Creating save: $BACKUP_DIR"

# Copy essential files
cp -r backend "$BACKUP_DIR/"
cp -r frontend "$BACKUP_DIR/"
cp docker-compose.yml "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp project-plan.txt "$BACKUP_DIR/"
cp README.md "$BACKUP_DIR/"

# Create save info
echo "Project saved at: $(date)" > "$BACKUP_DIR/SAVE-INFO.txt"
echo "Status: Working authentication system" >> "$BACKUP_DIR/SAVE-INFO.txt"
echo "User logged in: ✅" >> "$BACKUP_DIR/SAVE-INFO.txt"

echo "✅ Project saved successfully!"
echo "📁 Save location: $BACKUP_DIR"
echo "🕒 Timestamp: $TIMESTAMP" 