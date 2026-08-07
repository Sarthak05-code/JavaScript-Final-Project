const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const { name, source_code, assembly_output } = req.body;
    const [result] = await db.execute(
      "INSERT INTO programs (name, source_code, assembly_output) VALUES (?, ?, ?)",
      [name, source_code, assembly_output],
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM programs ORDER BY created_at DESC",
    );
    res.json({ success: true, programs: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM programs WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, program: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
