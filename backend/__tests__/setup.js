const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function setup() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function teardown() {
  await mongoose.disconnect();
  await mongod.stop();
}

async function clearDB() {
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }
}

module.exports = { setup, teardown, clearDB };
