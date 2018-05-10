const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const DISABLE_HEADERS = Symbol('disable_headers');
const REGISTER_MIDDLEWARE = Symbol('register_middleware');
const LOAD_MODULES = Symbol('load_modules');
const REGISTER_MODULE = Symbol('register_module');
const REGISTER_ERROR_HANDLER = Symbol('register_error_handler');

class Server {
  constructor() {
    this.app = express();
  }

  async start() {
    this[DISABLE_HEADERS]();
    this[REGISTER_MIDDLEWARE]();
    await this[LOAD_MODULES]();
    this[REGISTER_ERROR_HANDLER]();

    return this.app.listen(3000, () => {
      console.log('server started');
    });
  }

  [DISABLE_HEADERS]() {
    this.app.set('x-powered-by', false);
    this.app.set('etag', false);
  }

  [REGISTER_MIDDLEWARE]() {
    this.app.use(bodyParser.json());
  }

  async [LOAD_MODULES]() {
    const modulesPath = path.join(__dirname, './modules');
    const modules = fs.readdirSync(modulesPath)
      .filter((file) => fs.statSync(path.join(modulesPath, file)).isDirectory())
      .filter((directory) => fs.existsSync(path.join(modulesPath, directory, 'module.js')));

    for (const module of modules) {
      await this[REGISTER_MODULE](module);
    }
  }

  async [REGISTER_MODULE](moduleName) {
    const Module = require(`./modules/${moduleName}/module.js`);
    const module = new Module(this.app);
    await module.mount();
  }

  [REGISTER_ERROR_HANDLER]() {
    this.app.use((req, res, next) => {
      res.status(404);
      return res.send({ message: 'Not found' });
    });

    this.app.use((err, req, res, next) => {
      if (err.isJoi) {
        res.status(422);
        return res.send({ message: err.details[0].message });
      }

      res.status(500);
      return res.send({ message: 'Internal server error' });
    });
  }
}

module.exports = Server;
