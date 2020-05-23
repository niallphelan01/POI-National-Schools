const Users = require('./app/api/users');
const Pois = require('./app/api/pois');

module.exports = [
  { method: 'GET', path: '/api/users', config: Users.find }, //lists out all users
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne }, //list out just one user defined by the id of the user
  { method: 'POST', path: '/api/users', config: Users.create }, //create a user
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne }, //delete one user
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll }, //delete all users

  { method: 'GET', path: '/api/pois', config: Pois.findAll }, //get all the pois
  { method: 'GET', path: '/api/users/{id}/pois', config: Pois.findByUsersUpdate }, //list out the pois by the person whom updated them
];