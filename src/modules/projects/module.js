const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hi projects');
});

module.exports = { prefix: '/projects', router };
