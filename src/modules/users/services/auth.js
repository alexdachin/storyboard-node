const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Timestamp } = require('mongodb');
const db = require('./db');

module.exports = {
  /**
   * Check the username and password.
   *
   * @param {string} username - the username.
   * @param {string} password - the password.
   * @return {Object} the user or null if invalid credentials.
   */
  async checkUsernameAndPassword(username, password) {
    const users = db.get().collection('users');
    const user = await users.findOne({ username });
    const valid = user !== null && bcrypt.compareSync(password, user.password);
    if (!valid) return null;
    return user;
  },

  /**
   * Create a token for the specified user id.
   *
   * @param {Object} userId - the user id.
   * @param {string} userAgent - the browser user agent.
   * @param {string} ip - the user ip.
   * @return {string} the token.
   */
  async createTokenForUser(userId, userAgent = null, ip = null) {
    const token = crypto.randomBytes(32).toString('base64');
    const users = db.get().collection('users');
    await users.updateOne({ _id: userId }, {
      $push: {
        authTokens: {
          token,
          userAgent,
          ip,
          createdAt: new Timestamp(Date.now()/1000),
        },
      },
    });
    return token;
  },

  /**
   * Check if a username and token are valid credentials.
   *
   * @param {string} username - the username.
   * @param {string} token - the authentication token.
   * @return {Object} the user object or null.
   */
  async checkToken(username, token) {
    const users = db.get().collection('users');
    return await users.findOne({ username, authTokens: { $elemMatch: { token }}});
  },
};
