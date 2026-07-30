const db = require("./database");

async function getAllServices() {
  const [rows] = await db.query(
    "SELECT id, name, url, created_at FROM services ORDER BY id",
  );

  return rows;
}

async function createService(name, url) {
  const [result] = await db.execute(
    "INSERT INTO services (name, url) VALUES (?, ?)",
    [name, url],
  );

  return {
    id: result.insertId,
    name,
    url,
  };
}

module.exports = {
  getAllServices,
  createService,
};
