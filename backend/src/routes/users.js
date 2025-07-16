const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { User, Project, Task } = require('../models');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, requireRole(['admin']), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('role').optional().isIn(['admin', 'manager', 'member'])
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
    const { search, role } = req.query;

    // Build where clause
    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      users: users.rows,
      pagination: {
        page,
        limit,
        total: users.count,
        pages: Math.ceil(users.count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user' });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Project,
          as: 'ownedProjects',
          attributes: ['id', 'name', 'color', 'status'],
          limit: 5
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only or own profile)
router.put('/:id', auth, [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('avatar').optional().isURL(),
  body('role').optional().isIn(['admin', 'manager', 'member']),
  body('isActive').optional().isBoolean()
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
    const updateData = { ...req.body };

    // Users can only update their own profile unless they're admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Only admins can update role and isActive
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.isActive;
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's projects
router.get('/:id/projects', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own projects unless they're admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user\'s projects' });
    }

    const projects = await Project.findAll({
      where: { ownerId: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's assigned tasks
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own tasks unless they're admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user\'s tasks' });
    }

    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id },
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
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users (for team assignment)
router.get('/search/team', auth, [
  query('q').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { q } = req.query;

    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${q}%` } },
              { lastName: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } }
            ]
          },
          { isActive: true }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      limit: 10
    });

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own stats unless they're admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user\'s stats' });
    }

    // Get total projects
    const totalProjects = await Project.count({ where: { ownerId: id } });

    // Get active projects (not completed or on-hold)
    const activeProjects = await Project.count({
      where: {
        ownerId: id,
        status: {
          [Op.notIn]: ['completed', 'on-hold']
        }
      }
    });

    // Get total tasks assigned to user
    const totalTasks = await Task.count({
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id },
          attributes: []
        }
      ]
    });

    // Get completed tasks
    const completedTasks = await Task.count({
      where: { status: 'done' },
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id },
          attributes: []
        }
      ]
    });

    // Get overdue tasks (due date is in the past and not completed)
    const overdueTasks = await Task.count({
      where: {
        dueDate: {
          [Op.lt]: new Date()
        },
        status: {
          [Op.ne]: 'done'
        }
      },
      include: [
        {
          model: User,
          through: { attributes: [] },
          where: { id },
          attributes: []
        }
      ]
    });

    res.json({
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 