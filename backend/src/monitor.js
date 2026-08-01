const { checkService } = require("./serviceChecker");
const { getIO } = require("./socket");

const {
  getAllServices,
  recordServiceCheck,
  updateServiceStatus,
  deleteOldServiceChecks,
  getServiceStats,
} = require("./serviceRepository");

let lastCleanup = 0;

const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL = 10000;

async function runMonitoringCycle() {
  const now = Date.now();

  if (now - lastCleanup >= CLEANUP_INTERVAL) {
    const deleted = await deleteOldServiceChecks();

    console.log(`[Monitor] Deleted ${deleted} old check records`);

    lastCleanup = now;
  }

  try {
    const services = await getAllServices();

    const io = getIO();

    await Promise.all(
      services.map(async (service) => {
        const result = await checkService(service.url);

        await recordServiceCheck(
          service.id,
          result.status,
          result.responseTime,
          result.httpStatus,
        );

        await updateServiceStatus(
          service.id,
          result.status,
          result.responseTime,
          result.httpStatus,
        );

        const stats = await getServiceStats(service.id);

        io.emit("serviceUpdated", {
          service: {
            id: service.id,
            name: service.name,
            url: service.url,
            status: result.status,
            responseTime: result.responseTime,
            httpStatus: result.httpStatus,
          },
          stats,
        });
      }),
    );

    console.log(
      `[Monitor] Checked ${services.length} service(s) at ${new Date().toLocaleTimeString()}`,
    );
  } catch (error) {
    console.error("[Monitor] Monitoring cycle failed:", error);
  }
}

function startMonitoring() {
  runMonitoringCycle();

  setInterval(runMonitoringCycle, CHECK_INTERVAL);
}

module.exports = {
  startMonitoring,
};
