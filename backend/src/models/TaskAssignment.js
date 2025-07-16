const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const TaskAssignment = sequelize.define('TaskAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assignedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('assignee', 'reviewer', 'watcher'),
    defaultValue: 'assignee'
  }
}, {
  timestamps: true
});

module.exports = TaskAssignment; 