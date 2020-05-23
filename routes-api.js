const Users = require('./app/api/users');

module.exports = [
  { method: 'GET', path: '/api/users', config: Users.find }, //lists out all users
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne } //list out just one user defined by the id of the user

];