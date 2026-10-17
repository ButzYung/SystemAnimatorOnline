// (2025-08-24)

/***


  To run XR Animator as a localhost web app on your computer, you need to set up a local web server. If you are not familiar with such procedues, XR Animator provides a simple way using "Node.js". Follow the procedures below.

1. Install "Node.js".

  https://nodejs.org


2. Go to the folder where XR Animator resides (e.g. AT_SystemAnimator_v110350.gadget), run command prompt and enter the following.

  node XRA_node_server.js


3. By default, the localhost web server loads on port 3000. Change the value of "port" variable below with a port number you want.


4. Finally, load XR Animator as a web app by entering the following URL on any browser (replace 3000 with your port number).

  http://localhost:3000/XR_Animator.html


***/


const port = 3000;

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

// Define contentType object once, outside the server function
const contentType = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.csv': 'text/csv',
    '.md': 'text/markdown',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  '.mjs': 'text/javascript',
  '.wasm': 'application/wasm',
};

const server = http.createServer(async (req, res) => {
    try {
        // Parse the URL and extract the pathname (strips query string)
        const parsedUrl = url.parse(req.url);
        const decodedPath = decodeURI(parsedUrl.pathname);

        // Map the decoded pathname to a file path
// NOTE: Always load 'XR_Animator.html' manually as the URL and not as the default path, as it may cause some weird module instancing problems (mainly three.js)
        let filePath = path.join(__dirname, decodedPath === '/' ? '' : decodedPath);

        // Determine the content type based on file extension
        const extname = path.extname(filePath).toLowerCase();
        const mimeType = contentType[extname] || 'application/octet-stream';

        // Read the file
        const data = await fs.readFile(filePath);

        // Send the file
        res.statusCode = 200;
        res.setHeader('Content-Type', mimeType);
        res.end(data);
    } catch (err) {
        // Handle file not found or other errors
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found or error occurred\n');
        console.error(err);
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
