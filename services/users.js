const DBQuery = require('../db/query');

module.exports = async (req, res) => {

  try {
    const users = await DBQuery(`select * from users`);

    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ users }));
  } catch (error) {
    return res
      .writeHead(400, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ error: "Listing failed" }));
  }
};
