const auth = require('../services/auth');

const getUsername = (req) => req.header('x-username');
const getToken = (req) => {
  const authorization = req.header('authorization');
  if (!authorization) {
    return null;
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

module.exports = async (req, res, next) => {
  const username = getUsername(req);
  const token = getToken(req);

  if (!username || !token) {
    req.user = null;
    return next();
  } else {
    req.user = await auth.checkToken(username, token);
    return next();
  }
};
