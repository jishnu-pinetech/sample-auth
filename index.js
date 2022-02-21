require('dotenv').config();

const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8125;

const server = require('./server.js');
const connection = require('./db/connection');

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
