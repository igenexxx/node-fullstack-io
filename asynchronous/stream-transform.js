const { createReadStream, createWriteStream } = require("fs");
const { Transform } = require("stream");

createReadStream("test.txt")
  .pipe(shout())
  .pipe(createWriteStream("loud-text.txt"));

function shout() {
  return new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });
}
