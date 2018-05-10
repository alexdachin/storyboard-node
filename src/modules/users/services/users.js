const bcrypt = require('bcrypt');
const { Timestamp } = require('mongodb');
const db = require('./db');

module.exports = {
  /**
   * Create a user.
   *
   * @param {Object} user - the user to be created.
   * @return {Object} the inserted id.
   */
  async create(user) {
    const users = db.get().collection('users');
    const result = await users.insertOne({
      ...user,
      password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10)),
      createdAt: new Timestamp(Date.now()/1000),
    });
    return result.insertedId;
  },
};
