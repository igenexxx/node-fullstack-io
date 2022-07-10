const fs = require('fs').promises;
const path = require('path');

const filename = './test.txt';
const targetDirectory = process.argv[2] || './';

getFileLengths(targetDirectory)
    .then(results => {
        results.forEach(([file, length]) => console.log(`${file}: ${length}`));
        console.log('done!');
    })
    .catch(err => console.error(err));

fs.readFile(filename)
    .then(data => console.log(`${filename}: ${data.length}`))
    .catch(err => console.error(err));

fs.readdir('./')
    .then(filesList => Promise.all(filesList.map(file => fs.readFile(file).then(data => [file, data.length]))))
    .then(results => {
       results.forEach(([file, length]) => console.log(`${file}: ${length}`));
       console.log('Done');
    })
    .catch(console.error);

function getFileLengths (dir) {
    return fs.readdir(dir).then(fileList => {
        const readFiles = fileList.map(file => {
            const filePath = path.join(dir, file);
            return readFile(filePath)
        });
        return Promise.all(readFiles)
    })
}

function readFile (filePath) {
    return fs
        .readFile(filePath)
        .then(data => [filePath, data.length])
        .catch(err => {
            if (err.code === 'EISDIR') return [filePath, 0];
            throw err;
        })
}
