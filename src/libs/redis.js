const redis = require('redis');
const config = require('../config');

const client = redis.createClient(config.get('redis:uri'));

client.on('error', function (err) {
  console.log("Error: " + err);
});

module.exports = client;