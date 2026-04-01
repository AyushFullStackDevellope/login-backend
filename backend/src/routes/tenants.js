const express = require('express');
const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

// 1. Create tenant (minimal)
router.post('/', async (req, res) => {
  const { name, code, status } = req.body;
  if (!name || !code) {
    return errorResponse(res, 400, 'Missing required fields: name, code');
  }
  try {
    const result = await db.query(
      `INSERT INTO tenants (name, code, status) VALUES ($1, $2, $3) RETURNING *`,
      [name, code, status || 'active']
    );
    return successResponse(res, result.rows[0], 'Tenant created successfully');
  } catch (err) {
    console.error('Create tenant error:', err);
    if (err.code === '23505') {
       return errorResponse(res, 409, 'Tenant code already exists');
    }
    return errorResponse(res, 500, 'Internal server error');
  }
});

// 2. List tenants
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tenants WHERE status = $1 ORDER BY id DESC', ['active']);
    return successResponse(res, result.rows, 'Tenants fetched successfully');
  } catch (err) {
    console.error('List tenants error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
});

module.exports = router;

