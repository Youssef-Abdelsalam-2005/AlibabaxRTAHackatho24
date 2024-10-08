const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

let csvData = [];

app.get("/api/demand", (req, res) => {
  const filePath = "./taxidemand2.csv";
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      csvData.push(data);
    })
    .on("end", () => {
      // Perform your query here
      const result = csvData.filter(
        (row) => row["StartHour"] == req.query.hour
      );

      res.json(result);
    });
});
