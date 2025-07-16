const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const Comment = require('./Comment');

// User - Project relationships (Many-to-Many)
const ProjectMember = require('./ProjectMember');

// User - Task relationships (Many-to-Many)
const TaskAssignment = require('./TaskAssignment');

// Define associations
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

// Project - Task relationships
Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

// User - Task relationships (Many-to-Many through TaskAssignment)
User.belongsToMany(Task, { through: TaskAssignment, foreignKey: 'userId' });
Task.belongsToMany(User, { through: TaskAssignment, foreignKey: 'taskId' });

// User - Comment relationships
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Project - Comment relationships
Project.hasMany(Comment, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Comment.belongsTo(Project, { foreignKey: 'projectId' });

// Task - Comment relationships
Task.hasMany(Comment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

// Comment self-referencing (for replies)
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });

module.exports = {
  User,
  Project,
  Task,
  Comment,
  ProjectMember,
  TaskAssignment
}; 