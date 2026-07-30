const express = require("express");
const cors = require("cors");

const { checkService } = require("./serviceChecker");
const services = require("./services");

const app = express();

const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Service Monitor Backend is running!");
});

app.get("/api/services", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
