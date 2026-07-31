const { checkService } = require("./serviceChecker");

const {
  getAllServices,
  recordServiceCheck,
  updateServiceStatus,
  deleteOldServiceChecks,
} = require("./serviceRepository");

let lastCleanup = 0;
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

const CHECK_INTERVAL = 10000;

async function runMonitoringCycle() {
  const now = Date.now();

  if (now - lastCleanup >= CLEANUP_INTERVAL) {
    const deleted = await deleteOldServiceChecks();
    console.log(`[Monior] Deleted ${deleted} old checks records`);
  }
  try {
    const services = await getAllServices();

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

  setInterval(() => {
    runMonitoringCycle();
  }, CHECK_INTERVAL);
}

module.exports = {
  startMonitoring,
};
