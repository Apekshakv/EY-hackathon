
const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const mockData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/medicson.json"), "utf-8")
);

app.get("/", (req, res) => {
  res.render("index", { medicines: Object.keys(mockData) });
});


app.post("/analyze", (req, res) => {
  const { medicine, latitude, longitude } = req.body;
  const result = mockData[medicine];

  if (!result) {
    return res.send(" No mock data found for selected medicine");
  }

  // 📍 attach location
  result.location =
    latitude && longitude
      ? `Lat: ${latitude}, Lon: ${longitude}`
      : "Location not shared";

  // 🚦 recommendation logic
  if (result.confidence_score >= 0.8) {
    result.recommendation = "✅ Recommended to proceed for repurposing";
    result.recommendation_type = "good";
  } else if (result.confidence_score >= 0.65) {
    result.recommendation = "⚠️ Proceed with caution; further validation required";
    result.recommendation_type = "warn";
  } else {
    result.recommendation = "❌ Not recommended at this stage";
    result.recommendation_type = "bad";
  }

  res.render("result", { result });
});

// PDF ROUTE
app.get("/pdf", (req, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(18).text("Agentic AI – Drug Repurposing Report");
  doc.moveDown();
  doc.fontSize(12).text("This is a mock AI-generated report.");
  doc.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
