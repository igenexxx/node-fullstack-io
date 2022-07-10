const fs = require('fs');
const express = require('express');

const port = process.env.PORT || 1337;

const app = express();

const respondText = (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hi');
};

const respondJson = (req, res) => {
    res.json({ text: 'Hi', number: [1, 2, 3]});
};

const respondNotFound = (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
};

const respondEcho = (req, res) => {
    const { query: { input = '' }} = req;

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join(''),
    })
};

const respondStatic = (req, res) => {
    console.log(req.params);
    const filename = `${__dirname}/public/${req.params[0]}`;

    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res);
};

app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/static/*', respondStatic);

app.listen(port, () => `Server listening on port ${port}`);
