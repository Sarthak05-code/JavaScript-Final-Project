const express = require("express");
const cors = require("cors");

const { checkService } = require("./serviceChecker");
const { getAllServices, createService } = require("./serviceRepository");
const services = require("./services");

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
        error: "Name and Url are required",
      });
    }
    const service = await createService(name, url);
    res.status(201).json(service);
  } catch (error) {
    console.error("Failed to create service: ", error);

    res.status(500).json({
      error: "Failed to create service",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
