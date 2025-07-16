const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  type: {
    type: DataTypes.ENUM('comment', 'mention', 'system'),
    defaultValue: 'comment'
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Comments',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (comment) => {
      if (comment.changed('content')) {
        comment.isEdited = true;
        comment.editedAt = new Date();
      }
    }
  }
});

module.exports = Comment; 