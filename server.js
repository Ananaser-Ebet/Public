const WebSocket = require('ws');
const http = require('http');

const REAL_PASSWORD = process.env.PASSWORD || '';
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('devast proxy by ananaser');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (clientWS) => {
    console.log('client connected');

    const proxyWS = new WebSocket('wss://devast.us/?' + REAL_PASSWORD);

    proxyWS.on('message', (data) => {
        clientWS.send(data);
    });

    clientWS.on('message', (data) => {
        proxyWS.send(data);
    });

    proxyWS.on('close', () => clientWS.close());
    clientWS.on('close', () => proxyWS.close());
});

server.listen(PORT, () => {
    console.log('proxy running on port ' + PORT);
});
