const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'applilcation/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
};

function getFilePath(url) {
  switch (url) {
    case '/':
      return './views/index.html';
    case '/favicon.ico':
      return './views/index.html';
    case '/register':
      return './views/register.html';
    case '/login':
      return './views/login.html';
    case '/dashboard':
      return './views/dashboard.html';
    case '/api/users':
      return './services/users.js';
    case '/api/login':
      return './services/login.js';
    case '/api/register':
      return './services/register.js';
    default:
      return './views/400.html';
  }
}

module.exports = http.createServer(async (request, response) => {

  const filePath = getFilePath(request.url);

  const extname = String(path.extname(filePath)).toLowerCase();
  let contentType = 'text/html';

  contentType = mimeTypes[extname] || 'application/octect-stream';

  // call JS functions
  if (contentType === 'text/javascript') {
    const destFunction = require(filePath);

    return destFunction(request, response);
  }

  // render html files
  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        fs.readFile('./404.html', function (error, content) {
          return response.writeHead(200, { 'Content-Type': contentType }).end(content, 'utf-8');
        });
      } else {
        return response.writeHead(500).end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    }

    return response.writeHead(200, { 'Content-Type': contentType }).end(content, 'utf-8');
  });
});
