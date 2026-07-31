const express = require("express");
const cors = require("cors");

const { checkService } = require("./serviceChecker");
const {
  getAllServices,
  createService,
  deleteService,
  recordServiceCheck,
  getServiceStats,
} = require("./serviceRepository");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Service Monitor Backend is running!");
});

app.get("/api/services", async (req, res) => {
  try {
    const services = await getAllServices();

    const results = await Promise.all(
      services.map(async (service) => {
        const result = await checkService(service.url);

        await recordServiceCheck(
          service.id,
          result.status,
          result.responseTime,
          result.httpStatus,
        );

        return {
          ...service,
          ...result,
        };
      }),
    );

    res.json(results);
  } catch (error) {
    console.error("Failed to get services:", error);

    res.status(500).json({
      error: "Failed to load services",
    });
  }
});

app.post("/api/services", async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        error: "Name and URL are required",
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: "Invalid URL",
      });
    }

    const service = await createService(name.trim(), url.trim());

    res.status(201).json(service);
  } catch (error) {
    console.error("Failed to create service:", error);

    res.status(500).json({
      error: "Failed to create service",
    });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid Id",
      });
    }
    const affectedRows = await deleteService(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        error: "Service not found  ",
      });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete service : ", error);

    res.status(500).json({
      error: "Failed to delete service",
    });
  }
});

api.get("/api/services/:id/stats", async (req, res) => {
  try {
    const serviceId = Number(req.params.id);

    if (!Number.isInteger(serviceId) || serviceId < 0) {
      return res.status(400).json({
        error: "Invalid service id",
      });
    }
    const stats = await getServiceStats(serviceId);
    res.json(stats);
  } catch (error) {
    console.error("Failed to get service stats : ", error);

    res.status(500).json({
      error: "Failed to get service statistics",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
