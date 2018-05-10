const { Router } = require('express');
const mAuthenticatesUser = require('../users/middlewares/authenticates-user');

class ProjectsModule {
  constructor(app) {
    this.app = app;
  }

  mount() {
    this.router = Router();
    this.router.use(mAuthenticatesUser);

    // @todo
    this.router.get('/', (req, res) => {
      res.send({
        message: 'hi projects',
        user: req.user,
      });
    });

    this.app.use('/projects', this.router);
  }
}

module.exports = ProjectsModule;
