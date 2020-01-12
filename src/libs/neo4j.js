const neo4j = require("neo4j-driver");
const config = require('../config');

const driver = neo4j.driver(
  config.get('neo4j:uri') || "bolt://localhost:7687",
  neo4j.auth.basic(
    config.get('neo4j:user') || "root",
    config.get('neo4j:password') || "root"
  )
);

module.exports = driver;
