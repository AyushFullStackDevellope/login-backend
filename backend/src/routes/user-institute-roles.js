const express = require("express");
const db = require("../config/db");
const { successResponse, errorResponse } = require("../utils/response");

const router = express.Router();

// Create mapping
router.post("/", async (req, res) => {
  const { tenant_id, user_id, institute_id, role_id, is_primary } = req.body;

  if (!tenant_id || !user_id || !institute_id || !role_id) {
    return errorResponse(
      res,
      400,
      "Missing required fields: tenant_id, user_id, institute_id, role_id"
    );
  }

  try {
    const result = await db.query(
      `
      INSERT INTO user_institute_roles (
        tenant_id,
        user_id,
        institute_id,
        role_id,
        is_primary,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [tenant_id, user_id, institute_id, role_id, is_primary || false, "active"]
    );

    return successResponse(res, result.rows[0], "Mapping created successfully");
  } catch (err) {
    console.error("Create mapping error:", err);

    if (err.code === "23505") {
      return errorResponse(res, 409, "Mapping already exists");
    }

    return errorResponse(res, 500, "Internal server error");
  }
});

// List mappings
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  try {
    let query = `
      SELECT *
      FROM user_institute_roles
      WHERE status = $1
    `;
    const params = ["active"];

    if (user_id) {
      query += " AND user_id = $2";
      params.push(user_id);
    }

    query += " ORDER BY id DESC";

    const result = await db.query(query, params);

    return successResponse(res, result.rows, "Mappings fetched successfully");
  } catch (err) {
    console.error("List mappings error:", err);
    return errorResponse(res, 500, "Internal server error");
  }
});

module.exports = router;