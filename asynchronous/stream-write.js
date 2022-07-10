const { createWriteStream } = require("fs");

const writeStream = createWriteStream("time.log");
setInterval(() => writeStream.write(`The time is now: ${new Date()}\n`), 1000);
