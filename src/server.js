const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const DISABLE_HEADERS = Symbol('disable_headers');
const REGISTER_MIDDLEWARE = Symbol('register_middleware');
const LOAD_MODULES = Symbol('load_modules');
const REGISTER_MODULE = Symbol('register_module');

class Server {
  constructor() {
    this.app = express();
    this[DISABLE_HEADERS]();
    this[REGISTER_MIDDLEWARE]();
    this[LOAD_MODULES]();
  }

  [DISABLE_HEADERS]() {
    this.app.set('x-powered-by', false);
    this.app.set('etag', false);
  }

  [REGISTER_MIDDLEWARE]() {
    this.app.use(bodyParser.json());
  }

  [LOAD_MODULES]() {
    const modulesPath = path.join(__dirname, './modules');
    const modules = fs.readdirSync(modulesPath)
      .filter((file) => fs.statSync(path.join(modulesPath, file)).isDirectory())
      .filter((directory) => fs.existsSync(path.join(modulesPath, directory, 'module.js')));

    for (const module of modules) {
      this[REGISTER_MODULE](module);
    }
  }

  [REGISTER_MODULE](module) {
    const { prefix, router } = require(`./modules/${module}/module.js`);
    this.app.use(prefix, router);
  }

  start() {
    return this.app.listen(3000, () => {
      console.log('server started');
    });
  }
}

module.exports = Server;
