const Joi = require('joi');
const auth = require('../services/auth');
const users = require('../services/users');

module.exports = async (req, res, next) => {
  const joiResult = Joi.validate(req.body, Joi.object().keys({
    user: Joi.object().required().keys({
      username: Joi.string().required(),
      password: Joi.string().required().min(3),
    }),
  }));

  if (joiResult.error !== null) {
    return next(joiResult.error);
  }

  const user = await auth.checkUsernameAndPassword(
    req.body.user.username,
    req.body.user.password
  );

  if (user._id === null) {
    res.status(401);
    return res.send({ message: 'Invalid credentials' });
  }

  const token = await auth.createTokenForUser(user._id, req.header('user-agent'), req.ip);

  delete user.password;
  delete user.authTokens;
  res.status(200).send({ token, user });
};
