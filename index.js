const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  })
);
// Or, if you want more control over CORS settings:
const port = 3000;

let csvData = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/demand", async (req, res) => {
  function convertStringToDate(dateString) {
    // Split the string into day, month, and year
    const [day, month, year] = dateString.split("/");

    // Create a new Date object
    return new Date(year, month - 1, day);
  }
  function convert(input) {
    // Remove outer square brackets
    const cleanedInput = input.replace(/^\[|\]$/g, "");

    // Split into individual tuples
    const tuples = cleanedInput.split(", ");

    // Map each tuple to an array of floats
    return tuples.map((tuple) =>
      tuple.split(",").map((part) => parseFloat(part.trim()))
    );
  }
  let result;
  let events;
  const filePath = "./taxidemand2.csv";
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      csvData.push(data);
    })
    .on("end", async () => {
      // Perform your query here
      result = csvData.filter((row) => row["StartHour"] == req.query.hour);
      console.log(convert(result[0]["Dist"]));
      locations = convert(result[0]["Dist"]);
      csvData = [];

      fs.createReadStream("./Volunteers_Activities_And_Events.csv")
        .pipe(csv())
        .on("data", (data) => {
          csvData.push(data);
        })
        .on("end", () => {
          // Perform your query here
          const dateObj = new Date(req.query.date);
          events = csvData.filter((event) => {
            const startDate = new Date(event.eventstartingdate);
            const endDate = new Date(event.eventendingdate);
            const introDate = new Date(event.introductiondate);

            return (
              (introDate >= dateObj && startDate <= dateObj) ||
              (startDate >= dateObj && endDate <= dateObj) ||
              (introDate <= dateObj && endDate >= dateObj)
            );
          });

          console.log(locations);
          console.log(events);

          res.json({ locations, events });
        });
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
