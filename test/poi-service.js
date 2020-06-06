'use strict';

const axios = require('axios');
//const baseUrl = 'http://localhost:3000';

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    const response = await axios.get(this.baseUrl + '/api/users');
    return response.data;
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    const response = await axios.post(this.baseUrl + '/api/users', newUser);
    return response.data;
  }

  async deleteAllUsers() {
    const response = await axios.delete(this.baseUrl + '/api/users');
    return response.data;
  }

  async deleteOneUser(id) {
    const response = await axios.delete(this.baseUrl + '/api/users/' + id);
    return response.data;
  }
  async createPoi(id, poi) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users/' + id + '/pois', poi);
      return response.data;
    } catch (e) {
      console.log(e)
      return null;
    }
  }
  async getPoisbyId(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/pois/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async getPois(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/users/' + id + '/pois');
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async getAllPois() {
    try {
      const response = await axios.get(this.baseUrl + '/api/pois');
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async deleteAllPois() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/pois');
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async deleteOnePoi(id) {
    try {
      const response = await axios.delete(this.baseUrl + '/api/pois/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async clearAuth(user) {
    axios.defaults.headers.common['Authorization'] = '';
  }
}

module.exports = PoiService;