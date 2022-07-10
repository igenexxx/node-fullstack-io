const fs = require('fs');
const path = require('path');
const jsonArrayStreams = require("json-array-streams");
const through = require("through2");
const { Transform } = require('stream');

const tagsCollection = ["girls", "girly", "girl", "powerpuff girls", "to girls", "for girls", "top girls", "girlfriend", "1975 girls", "girls 1975", "fail girls", "2 girls pubg", "drunk girls", "girls fails", "spice girls", "funny girls", "girls at home", "big girls cry", "tik tok girls", "tiktok girls", "top girls hit", "girls the 1975", "rita ora girls", "two girls pubg", "the 1975 girls", "girls like you", "girls and guys", "chicken girls", "power pop girls", "hacks for girls", "girls fails 2020", "power puff girls", "cats", "funny cats", "cats movie", "cats trailer", "cat", "cute cats", "cats review", "cats meowing", "baby cats", "cats film", "cats 2019", "meowing cats", "funny cat", "funny cat videos", "cats meowing loudly", "cute", "cute cats and kittens", "cats rt", "cats bad", "cats gus", "cats and kittens meowing", "kittens and cats meowing", "pets", "cat videos", "cats clip", "cats cast", "cats plot", "cats 2020", "cats maze", "cats song", "chats scènes de cats", "cats funny", "cats scene", "cats video", "cats dance","sex", "sex education", "sex ed", "sex doll", "sex toys", "sexpo", "sex education netflix", "sex bomb", "sex life", "sex education bloopers", "sex robot", "sex dolls", "sex comedy", "sex slaves", "sex injury", "sex addict", "sex scenes", "sex sent me", "sex sounds", "sex mishaps", "morning sex", "evening sex", "flugzeug sex", "sex industry", "male sex doll", "sex short film", "sex for grades", "sex accidents", "male sex robots", "tjay sex sounds", "lockdown and sex", "sex and lockdown"];

const getRandomNumber = (max, min = 0) => Math.round(Math.random() * (max - min) + min);

function getRandomTags(tagsArray, count) {
  return Array.from({ length: count }, () => {
    return tagsArray[getRandomNumber(tagsArray.length - 1)];
  })
}

function updateProducts(filename) {
  const fileStream = fs.createReadStream(path.join(__dirname, filename));
  const result = fs.createWriteStream(path.join(__dirname, `${filename.replace('.json', '')}_1.json`));
  fileStream
    .pipe(jsonArrayStreams.parse())
    .pipe(putTag())
    .pipe(jsonArrayStreams.stringify())
    .pipe(result);
}

function putTag() {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const result = {
        ...chunk,
        tags:  getRandomTags(tagsCollection, getRandomNumber(7))
      };
      callback(null, result);
    }
  })
}

updateProducts('./products.json');
