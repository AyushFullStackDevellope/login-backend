const express = require("express");
const db = require("../config/db");
const { successResponse, errorResponse } = require("../utils/response");

const router = express.Router();

// Create institute
router.post("/", async (req, res) => {
  const { tenant_id, name, code, type, city, state, logo, status } = req.body;

  if (!tenant_id || !name || !code || !type) {
    return errorResponse(
      res,
      400,
      "Missing required fields: tenant_id, name, code, type"
    );
  }

  try {
    const result = await db.query(
      `
      INSERT INTO institutes (
        tenant_id,
        name,
        code,
        type,
        city,
        state,
        logo,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        tenant_id,
        name,
        code,
        type,
        city || null,
        state || null,
        logo || "",
        status || "active",
      ]
    );

    return successResponse(
      res,
      result.rows[0],
      "Institute created successfully"
    );
  } catch (err) {
    console.error("Create institute error:", err);

    if (err.code === "23505") {
      return errorResponse(res, 409, "Institute code already exists");
    }

    return errorResponse(res, 500, "Internal server error");
  }
});

// List institutes
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM institutes
      WHERE status = $1
      ORDER BY id DESC
      `,
      ["active"]
    );

    return successResponse(
      res,
      result.rows,
      "Institutes fetched successfully"
    );
  } catch (err) {
    console.error("List institutes error:", err);
    return errorResponse(res, 500, "Internal server error");
  }
});

module.exports = router;