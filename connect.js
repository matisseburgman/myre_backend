const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./config.env"});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
  connectToServer: async () => {
    try {
      // Connect to the MongoDB server and keep the connection open
      await client.connect();
      database = client.db("BlogData");  // Make sure this is pointing to the correct database name
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  },

  getDb: () => {
    if (!database) {
      throw new Error("Database has not been initialized. Please call connectToServer() first.");
    }
    return database;
  }
};