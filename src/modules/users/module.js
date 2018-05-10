const { Router } = require('express');
const db = require('./services/db');
const aCreate = require('./actions/create');
const aLogin = require('./actions/login');

class UsersModule {
  constructor(app) {
    this.app = app;
  }

  async mount() {
    await db.connect();
    this.router = Router();
    this.router.post('/', aCreate);
    this.router.post('/login', aLogin);
    this.app.use('/users', this.router);
  }
}

module.exports = UsersModule;
