const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const {
  generatePreContextToken,
  generateAccessToken,
  verifyToken,
} = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

const router = express.Router();

// 1. Login - returns pre-context token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Email and password are required");
  }

  try {
    const result = await db.query(
      `
      SELECT id, email, password_hash, first_name, last_name, full_name
      FROM users
      WHERE email = $1 AND status = $2
      `,
      [email, "active"]
    );

    if (result.rowCount === 0) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const preContextToken = generatePreContextToken({
      user_id: user.id,
      email: user.email,
    });

    const userInfo = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };

    return successResponse(
      res,
      {
        pre_context_token: preContextToken,
        user: userInfo,
      },
      "Login successful"
    );
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(res, 500, "Internal server error");
  }
});

// 2. Get institutes & roles for logged-in user (pre-context token)
router.get("/my-institutes-roles", verifyToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const query = `
      SELECT 
        uir.tenant_id,
        i.id AS institute_id,
        i.name AS institute_name,
        i.type,
        i.city,
        i.state,
        i.logo,
        r.id AS role_id,
        r.name AS role_name
      FROM user_institute_roles uir
      JOIN institutes i ON i.id = uir.institute_id
      JOIN roles r ON r.id = uir.role_id
      WHERE uir.user_id = $1 AND uir.status = 'active'
      ORDER BY i.name, r.name
    `;

    const result = await db.query(query, [userId]);
    const groupedMap = {};

    result.rows.forEach((row) => {
      if (!groupedMap[row.institute_id]) {
        groupedMap[row.institute_id] = {
          tenant_id: row.tenant_id,
          institute_id: row.institute_id,
          institute_name: row.institute_name,
          type: row.type || "Institution",
          city: row.city || "",
          state: row.state || "",
          logo: row.logo || "",
          roles: [],
        };
      }

      groupedMap[row.institute_id].roles.push({
        role_id: row.role_id,
        role_name: row.role_name,
      });
    });

    const data = Object.values(groupedMap);
    return successResponse(res, data, "Institutes and roles fetched");
  } catch (err) {
    console.error("Fetch institutes/roles error:", err);
    return errorResponse(res, 500, "Internal server error");
  }
});

// 3. Select institute context - returns scoped access token
router.post("/select-context", verifyToken, async (req, res) => {
  const { tenant_id, institute_id, role_id } = req.body;
  const userId = req.user.user_id;

  if (!tenant_id || !institute_id || !role_id) {
    return errorResponse(res, 400, "tenant_id, institute_id and role_id are required");
  }

  try {
    const check = await db.query(
      `
      SELECT id
      FROM user_institute_roles
      WHERE user_id = $1
        AND tenant_id = $2
        AND institute_id = $3
        AND role_id = $4
        AND status = $5
      `,
      [userId, tenant_id, institute_id, role_id, "active"]
    );

    if (check.rowCount === 0) {
      return errorResponse(res, 403, "Invalid institute/role selection");
    }

    const accessToken = generateAccessToken({
      user_id: userId,
      tenant_id,
      institute_id,
      role_id,
    });

    const selected_context = {
      tenant_id,
      institute_id,
      role_id,
    };

    return successResponse(
      res,
      {
        access_token: accessToken,
        selected_context,
      },
      "Context selected"
    );
  } catch (err) {
    console.error("Select context error:", err);
    return errorResponse(res, 500, "Internal server error");
  }
});

// 4. Logout - simple success response
router.post("/logout", verifyToken, (req, res) => {
  return successResponse(res, {}, "Logged out successfully");
});

// 5. Current user profile (access token)
router.get("/me", verifyToken, (req, res) => {
  const { user_id, tenant_id, institute_id, role_id } = req.user;

  return successResponse(
    res,
    {
      user_id,
      tenant_id,
      institute_id,
      role_id,
    },
    "User profile fetched"
  );
});

module.exports = router;