const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();
const port = 3000;

let csvData = [];

app.get("/api/demand", (req, res) => {
  let result;
  let events;
  const filePath = "./taxidemand2.csv";
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      csvData.push(data);
    })
    .on("end", () => {
      // Perform your query here
      result = csvData.filter((row) => row["StartHour"] == req.query.hour);
    });
  fs.createReadStream("./Volunteers_Activities_And_Events.csv")
    .pipe(csv())
    .on("data", (data) => {
      csvData.push(data);
    })
    .on("end", () => {
      // Perform your query here
      events = csvData.filter(
        (row) =>
          row["eventstartingdate"] < req.query.date &&
          row["eventendingdate"] > req.query.date
      );
    });
  res.json(result, events);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
