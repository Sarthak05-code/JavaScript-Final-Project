const db = require("./database");

async function getAllServices() {
  const [rows] = await db.query(
    `SELECT
      id,
      name,
      url,
      status,
      response_time AS responseTime,
      http_status AS httpStatus,
      last_checked AS lastChecked,
      created_at
     FROM services
     ORDER BY id`,
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

async function deleteService(id) {
  const [result] = await db.execute("DELETE FROM services WHERE id = ?", [id]);

  return result.affectedRows;
}

async function recordServiceCheck(serviceId, status, responseTime, httpStatus) {
  await db.execute(
    `INSERT INTO service_checks
        (service_id, status, response_time, http_status)
        VALUES (?, ?, ?, ?)`,
    [serviceId, status, responseTime, httpStatus],
  );
}

async function getServiceStats(serviceId) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS totalChecks,
      SUM(status = 'UP') AS sucessfulChecks,
      AVG(response_time) AS averageResponseTime
    FROM service_checks
    WHERE service_id = ?`,
    [serviceId],
  );

  const stats = rows[0];
  const totalChecks = Number(stats.totalChecks);
  const sucessfulChecks = Number(stats.sucessfulChecks || 0);

  const uptime = totalChecks === 0 ? 0 : (sucessfulChecks / totalChecks) * 100;

  return {
    totalChecks,
    sucessfulChecks,
    uptime,
    averageResponseTime:
      stats.averageResponseTime === null
        ? null
        : Number(stats.averageResponseTime),
  };
}

async function updateServiceStatus(
  serviceId,
  status,
  responseTime,
  httpStatus,
) {
  await db.execute(
    `UPDATE services
     SET status = ?,
         response_time = ?,
         http_status = ?,
         last_checked = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, responseTime ?? null, httpStatus ?? null, serviceId],
  );
}

async function deleteOldServiceChecks() {
  const [result] = await db.execute(
    `DELETE FROM service_checks
     WHERE checked_at < NOW() - INTERVAL 7 DAY`,
  );

  return result.affectedRows;
}

module.exports = {
  getAllServices,
  createService,
  deleteService,
  recordServiceCheck,
  getServiceStats,
  updateServiceStatus,
  deleteOldServiceChecks,
};
