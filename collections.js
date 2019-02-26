const mongoist = require('mongoist');
const db = mongoist('localhost/express-practice');

module.exports = {
  Users: db.users,
};