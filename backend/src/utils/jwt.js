const jwt = require('jsonwebtoken');
const { errorResponse } = require('./response');
require('dotenv').config();

const PRE_CONTEXT_EXPIRES_IN = '8h';
const ACCESS_EXPIRES_IN = '8h';

function generatePreContextToken(payload) {
  const tokenPayload = {
    user_id: payload.user_id,
    email: payload.email,
    token_type: 'pre_context',
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: PRE_CONTEXT_EXPIRES_IN });
}

function generateAccessToken(payload) {
  const tokenPayload = {
    user_id: payload.user_id,
    tenant_id: payload.tenant_id,
    institute_id: payload.institute_id,
    role_id: payload.role_id,
    token_type: 'access',
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return errorResponse(res, 401, 'Missing Authorization header');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return errorResponse(res, 401, 'Token not provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 403, 'Invalid or expired token');
  }
}

module.exports = { generatePreContextToken, generateAccessToken, verifyToken };