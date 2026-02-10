const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    let filePath = req.url.split('?')[0];

    if (filePath === '/') {
        res.writeHead(302, { 'Location': '/config' });
        res.end();
        return;
    }

    if (filePath === '/config' || filePath === '/lua') {
        filePath = '/index.html';
    }

    const fullPath = path.join(__dirname, filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Cache-Control': 'no-store, no-cache, must-revalidate',
                            'Expires': '0'
                        });
                        res.end(data, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Expires': '0'
            });
            res.end(data, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\nServer stopped.');
    process.exit(0);
});
