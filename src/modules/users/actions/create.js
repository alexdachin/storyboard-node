const Joi = require('joi');
const users = require('../services/users');

module.exports = async (req, res, next) => {
  const joiResult = Joi.validate(req.body, Joi.object().keys({
    user: Joi.object().required().keys({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required().min(3),
    }),
  }));

  if (joiResult.error !== null) {
    return next(joiResult.error);
  }

  try {
    await users.create(req.body.user);
    res.status(201).send();
  } catch (e) {
    return next(e);
  }
};
