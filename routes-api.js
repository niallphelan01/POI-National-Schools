const Users = require('./app/api/users');
const Pois = require('./app/api/pois');
const Locations = require('./app/api/locations');

module.exports = [
  { method: 'GET', path: '/api/users', config: Users.find }, //lists out all users
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne }, //list out just one user defined by the id of the user
  { method: 'POST', path: '/api/users', config: Users.create }, //create a user
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne }, //delete one user
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll }, //delete all users
  { method: 'PUT', path: '/api/users/{id}', config: Users.updateOne },


  { method: 'GET', path: '/api/pois', config: Pois.findAll}, //get all the pois
  { method: 'GET', path: '/api/users/{id}/pois', config: Pois.findByUsersUpdated}, //list out the pois by the person whom updated them
  { method: 'POST', path: '/api/users/{id}/pois', config: Pois.createPoi},
  { method: 'DELETE', path: '/api/pois', config: Pois.deleteAll},
  { method: 'DELETE', path: '/api/pois/{id}', config: Pois.deleteOne},
  { method: 'PUT', path: '/api/pois/{id}', config: Pois.updateOne},
  { method: 'GET', path: '/api/pois/{id}', config: Pois.findByPoiId}, //get the pois by poisId


  { method: 'GET', path: '/api/locations', config: Locations.findAll }, //lists out all locations
  { method: 'POST', path: '/api/locations', config: Locations.createLocation }, //lists out all locations
  { method: 'DELETE', path: '/api/locations', config: Locations.deleteAll }, //delete all locations

  { method: 'POST', path: '/api/users/authenticate', config: Users.authenticate },  //root for auth added
];