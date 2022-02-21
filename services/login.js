const DBQuery = require('../db/query');

module.exports = (req, res) => {
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
      const user = await DBQuery(`select * from users where email = ?`, reqBody.email);
      if (!user.length) {
        return res
          .writeHead(404, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ error: "No user registered with this email" }));
      }

      const { password, ...rest } = user[0];

      if (password !== reqBody.password) {
        return res
          .writeHead(400, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ error: "Password not matched" }));
      }

      return res
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ message: "Login successfull", ...rest }));
    } catch (error) {
      return res
        .writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ error: "Login failed" }));
    }
  });
};
