const express = require("express");
const path = require("path");

const app = express();
const dataDir = path.join(__dirname, "../..", "data");
const countriesDir = path.join(dataDir, "countries");

app.use(express.static("dist"));
app.use(express.static("images"));
app.get("/api/countries", (req, res) =>
  res.sendFile(path.join(dataDir, "countries.json"))
);
app.get("/api/country/:id", (req, res) => {
  const countryId = (req.params.id || "").toLowerCase();
  if (!countryId) res.status(404).send("Invalid country id");
  res.sendFile(path.join(countriesDir, `${countryId}.json`));
});
app.get("/api/world", (req, res) =>
  res.sendFile(path.join(dataDir, "world.json"))
);

app.listen(3001, () => console.log("Listening on port 3001!"));
