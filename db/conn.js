require('dotenv').config()

const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI;
const dbName = process.env.ATLAS_DB;

var _connection;
var _db;


const closeConnection = () => {
    _connection.close();
  }
  
  /**
   * Connects to mongodb using config/config.js
   * 
   * @returns {MongoClient.db}
   */
  const getDbConnection = async () => {
    if (_db) {
      return _db;
    }
    console.log('trying to connect '+connectionString);
    const mongoClient = new MongoClient(connectionString);
    _connection = await mongoClient.connect();
    _db = _connection.db(dbName);
    
    console.log("Connected")
    return _db;
  }
  
  
  module.exports = { getDbConnection, closeConnection };

