const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// LOAD MOCK DATA
const mockData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/medicson.json"), "utf-8")
);

// HOME PAGE
app.get("/", (req, res) => {
  res.render("index", { medicines: Object.keys(mockData) });
});

// ANALYZE
app.post("/analyze", (req, res) => {
  const medicine = req.body.medicine;
  const result = mockData[medicine];

  if (!result) {
    return res.send("No mock data found");
  }

  res.render("result", { result });
});

// PDF
app.get("/pdf", (req, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(18).text("Agentic AI – Drug Repurposing Report");
  doc.moveDown();
  doc.fontSize(12).text("This is a mock AI-generated report.");
  doc.end();
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
