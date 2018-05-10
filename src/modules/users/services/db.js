const { MongoClient } = require('mongodb');

let connection = null;

module.exports = {
  /**
   * Connect to the database.
   *
   * @return {void}
   */
  async connect() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    connection = client.db('storyboard');
  },

  /**
   * Get the connection.
   *
   * @throws {Error} if connection is not ready yet.
   * @return {Object} the connection.
   */
  get() {
    if (connection === null) {
      throw new Error('Connection not ready');
    }
    return connection;
  }
};
