const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Task, User, Project, Comment, TaskAssignment } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks (with filtering and pagination)
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('projectId').optional().isUUID(),
  query('assigneeId').optional().isUUID(),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, priority, projectId, assigneeId, search } = req.query;

    // Build where clause
    const whereClause = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (projectId) whereClause.projectId = projectId;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get tasks with related data
    const tasks = await Task.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
          where: assigneeId ? { id: assigneeId } : undefined
        }
      ],
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      tasks: tasks.rows,
      pagination: {
        page,
        limit,
        total: tasks.count,
        pages: Math.ceil(tasks.count / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color', 'ownerId']
        },
        {
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim(),
  body('projectId').isUUID(),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('assigneeIds').optional().isArray(),
  body('assigneeIds.*').optional().isUUID(),
  body('tags').optional().isArray(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { assigneeIds, ...taskData } = req.body;

    // Verify project exists and user has access
    const project = await Project.findByPk(taskData.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is project owner or has access
    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    // Create task
    const task = await Task.create(taskData);

    // Assign users to task
    if (assigneeIds && assigneeIds.length > 0) {
      const assignments = assigneeIds.map(userId => ({
        taskId: task.id,
        userId,
        assignedBy: req.user.id,
        role: 'assignee'
      }));

      await TaskAssignment.bulkCreate(assignments);
    }

    // Get task with related data
    const taskWithData = await Task.findByPk(task.id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: taskWithData
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('actualHours').optional().isFloat({ min: 0 }),
  body('assigneeIds').optional().isArray(),
  body('assigneeIds.*').optional().isUUID(),
  body('tags').optional().isArray(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { assigneeIds, ...updateData } = req.body;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'ownerId']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to update task
    if (task.Project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update task
    await task.update(updateData);

    // Update assignments if provided
    if (assigneeIds !== undefined) {
      // Remove existing assignments
      await TaskAssignment.destroy({ where: { taskId: id } });

      // Create new assignments
      if (assigneeIds.length > 0) {
        const assignments = assigneeIds.map(userId => ({
          taskId: id,
          userId,
          assignedBy: req.user.id,
          role: 'assignee'
        }));

        await TaskAssignment.bulkCreate(assignments);
      }
    }

    // Get updated task with related data
    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['ownerId']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to delete task
    if (task.Project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.patch('/:id/status', auth, [
  body('status').isIn(['todo', 'in-progress', 'review', 'done'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ status });

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's assigned tasks
router.get('/user/assigned', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id: req.user.id },
          attributes: []
        },
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        }
      ],
      order: [['dueDate', 'ASC'], ['priority', 'DESC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 