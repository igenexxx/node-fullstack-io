const fs = require('fs').promises;
const path = require('path');
const targetDirectory = process.argv[2] || './';
printLengths(targetDirectory);
async function printLengths (dir) {
    try {
        const results = await getFileLengths(dir)
        results.forEach(([file, length]) => console.log(`${file}: ${length}`));
        console.log('done!');
    } catch (err) {
        console.error(err);
    }
}
async function getFileLengths (dir) {
    const fileList = await fs.readdir(dir);
    const readFiles = fileList.map(async file => {
        const filePath = path.join(dir, file);
        return await readFile(filePath);
    });
    return await Promise.all(readFiles);
}
async function readFile (filePath) {
    try {
        const data = await fs.readFile(filePath);
        return [filePath, data.length];
    } catch (err) {
        if (err.code === 'EISDIR') return [filePath, 0];
        throw err;
    }
}
