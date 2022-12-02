const { MongoClient } = require('mongodb');

const mongo = new MongoClient(process.env.MONGO);
mongo.connect((err, res) => {
  if (err) console.log("[mongodb]: Unable to connect");
  else console.log("[mongodb]: Successful connection");
});

module.exports = {mongo: mongo.db('db')};
