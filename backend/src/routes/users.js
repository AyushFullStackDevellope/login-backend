const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

// 1. Create user
router.post('/', async (req, res) => {
  const { first_name, last_name, email, mobile, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return errorResponse(res, 400, 'Missing required fields: first_name, last_name, email, password');
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, full_name, email, mobile, password_hash, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, full_name, email, mobile, status`,
      [first_name, last_name, `${first_name} ${last_name}`, email, mobile || null, hash, 'active']
    );
    return successResponse(res, result.rows[0], 'User created successfully');
  } catch (err) {
    console.error('Create user error:', err);
    if (err.code === '23505') { // Unique violation
      return errorResponse(res, 409, 'Email already exists');
    }
    return errorResponse(res, 500, 'Internal server error');
  }
});

// 2. List users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, first_name, last_name, full_name, email, mobile, status FROM users WHERE status = $1 ORDER BY id DESC', ['active']);
    return successResponse(res, result.rows, 'Users fetched successfully');
  } catch (err) {
    console.error('List users error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
});

module.exports = router;

