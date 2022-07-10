const { createReadStream } = require("fs");
const csv = require("csv-parser");
const { Transform } = require("stream");

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

createReadStream("./people.csv")
  .pipe(csv())
  .pipe(clean())
  .on("data", (row) => console.log(JSON.stringify(row)));

function clean() {
  return new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      const [firstName, lastName] = row.name.split(" ");
      const age = Math.floor((Date.now() - new Date(row.dob)) / YEAR_MS);
      callback(null, {
        firstName,
        lastName,
        age,
      });
    },
  });
}
