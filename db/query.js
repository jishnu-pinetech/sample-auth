const DBConnection = require('./connection');

const HttpStatusCodes = Object.freeze({
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
  ER_DUP_ENTRY: 409
});

module.exports = async (sql, values) => {
  return new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    }

    DBConnection.query(sql, values, callback);
  }).catch(err => {
    const mysqlErrorList = Object.keys(HttpStatusCodes);
    // convert mysql errors which in the mysqlErrorList list to http status code
    err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

    throw err;
  });
}