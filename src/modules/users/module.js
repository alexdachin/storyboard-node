const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hi users');
});

module.exports = { prefix: '/users', router };
