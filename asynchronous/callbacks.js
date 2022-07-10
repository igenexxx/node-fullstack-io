const fs = require('fs');
const filename = './test.txt';
const path = require('path');

const targetDirectory = process.argv[2] || './';

/*(async () => {
    console.log(await new Promise((res, rej) => {
        fs.readFile(filename, (err, fileData) => {
            if (err) return rej(err);

            return res(`${filename}: ${fileData.length}`);
        });
    }));
})();

fs.readdir('./', (err, fileList) => {
    if (err) return console.error(err);

    console.log(fileList);
});*/

/*
fs.readdir('./', (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        fs.readFile(file, (err, data) => {
            if (err) return console.error(err);

            console.log(`${file}: ${file.length}`);
        })
    });
    console.log('done!');
});
*/

function mapAsync (arr, fn, onFinish) {
    let nRemaining = arr.length;
    const results = [];
    try {
        arr.forEach((item, i) => {
            fn(item, (err, data) => {
                if (err) throw new Error(err);

                results[i] = data;
                nRemaining--;

                if (!nRemaining) onFinish(null, results)
            })
        })
    } catch(e) {
        onFinish(e)
    }

}

function mapSync (arr, fn) {
    const results = [];
    arr.forEach((item, i) => {
        const data = fn(item);
        results[i] = data;
    });
    return results;
}

// fs.readdir('./', function (err, files) {
//     if (err) return console.error(err);
//     mapAsync(files, fs.readFile, (err, results) => {
//         if (err) return console.error(err);
//         results.forEach((data, i) => console.log(`${files[i]}: ${data.length}`));
//         console.log('done!');
//     })
// });

function readFile (file, cb) {
    fs.readFile(file, function (err, fileData) {
        if (err) {
            if (err.code === 'EISDIR') return cb(null, [file, 0]);
            return cb(err)
        }
        cb(null, [file, fileData.length])
    })
}

function getFileLengths (dir, cb) {
    fs.readdir(dir, function (err, files) {
        if (err) return cb(err)
        const filePaths = files.map(file => path.join(dir, file))
        mapAsync(filePaths, readFile, cb)
    })
}

getFileLengths(targetDirectory, function (err, results) {
    if (err) return console.error(err)
    results.forEach(([file, length]) => console.log(`${file}: ${length}`))
    console.log('done!')
});

