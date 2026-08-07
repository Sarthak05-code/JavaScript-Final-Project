const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/compile", require("./routes/compile"));
app.use("/api/programs", require("./routes/programs"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
