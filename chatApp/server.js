const fs = require('fs');
const express = require('express');
const EventEmitter = require('events');
const readline = require('readline');
const http = require('http');
const querystring = require('querystring');

const rl = readline.createInterface({
    input: process.stdin,
});

const chatEmitter = new EventEmitter();
// chatEmitter.on('message', console.log);

const port = process.env.PORT || 1337;
const app = express();

rl.on('line', line => http.get(`http://localhost:${port}/chat?${querystring.stringify({ message: line })}`));

app.get('/chat', respondChat);
app.get('/sse', respondSSE);
app.get('/static/*', respondStatic);

function respondChat(req, res) {
    const { message } = req.query;

    chatEmitter.emit('message', message);
    logging(message + '\n');
    res.end();
}

function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const onMessage = msg => res.write(`data: ${msg}\n\n`);
    console.log('RespondSSE');
    chatEmitter.on('message', onMessage);
    getLastMessage();
    req.on('data', data => console.log('Data:', data.toString()));
    res.on('close', () => chatEmitter.off('message', onMessage));
}

function respondStatic (req, res) {
    const filename = `${__dirname}/static/${req.params[0]}`;

    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res);
}

function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

function logging(message) {
    fs.appendFile('./message_log.txt', message, err => {
        if (err) {
            throw new Error(`Some error occur during writing in file: ${err}`);
        }
    })
}

function getLastMessage() {
    const isExists = fs.existsSync('./message_log.txt');
    if (isExists) {
        fs.readFile('./message_log.txt', 'utf-8', (err, data) => {
            if (data) {
                const result = data.slice(data.lastIndexOf('\n', data.length - 5));
                chatEmitter.emit('message', result.trim());
            }
        });
    }
}

app.listen(port, () => `Server is running on port ${port}`);
