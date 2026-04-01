const express = require('express');
const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

// 1. Create role
router.post('/', async (req, res) => {
  const { name, code, description, status } = req.body;
  if (!name || !code) {
    return errorResponse(res, 400, 'Missing required fields: name, code');
  }
  try {
    const result = await db.query(
      `INSERT INTO roles (name, code, description, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, code, description || null, status || 'active']
    );
    return successResponse(res, result.rows[0], 'Role created successfully');
  } catch (err) {
    console.error('Create role error:', err);
    if (err.code === '23505') {
      return errorResponse(res, 409, 'Role code already exists');
    }
    return errorResponse(res, 500, 'Internal server error');
  }
});

// 2. List roles
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM roles WHERE status = $1 ORDER BY id DESC', ['active']);
    return successResponse(res, result.rows, 'Roles fetched successfully');
  } catch (err) {
    console.error('List roles error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
});

module.exports = router;

