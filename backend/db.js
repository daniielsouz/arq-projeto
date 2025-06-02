require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

let singleton;

async function connect() {
  if (singleton) return singleton;

  const client = new MongoClient(process.env.MONGO_HOST);
  await client.connect();
  singleton = client.db(process.env.MONGO_DATABASE);
  return singleton;
}

async function insert(project) {
  const db = await connect();
  return db.collection('projetos').insertOne(project);
}

async function find() {
  const db = await connect();
  return db.collection('projetos').find().sort({ createdAt: -1 }).toArray();
}

async function findLatestThree() {
  const db = await connect();
  return db
    .collection('projetos')
    .find()
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();
}

async function findById(id) {
  const db = await connect();
  return db.collection('projetos').findOne({ _id: new ObjectId(id) });
}

async function removeProject(id) {
  const db = await connect();
  return db.collection('projetos').deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  connect,
  insert,
  find,
  findLatestThree,
  findById,
  removeProject,
};
