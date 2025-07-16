const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'member', 'viewer'),
    defaultValue: 'member'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      canEdit: true,
      canDelete: false,
      canInvite: false,
      canManageTasks: true
    }
  }
}, {
  timestamps: true
});

module.exports = ProjectMember; 