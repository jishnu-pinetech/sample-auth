const DBQuery = require('../db/query');

module.exports = (req, res, next) => {
  let reqBody = [];
  req.on('error', (err) => {
    return res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: err }));
  }).on('data', (chunk) => {
    reqBody.push(chunk);
  }).on('end', async () => {
    reqBody = JSON.parse(Buffer.concat(reqBody).toString());

    try {
      await DBQuery(`insert into users set ?`, reqBody);
      return res
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ message: "Register successfull", email: reqBody.email }));
    } catch (error) {
      return res
        .writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ error: "Registration failed" }));
    }
  });
};
