require("dotenv").config();
const mongoose = require("mongoose");

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.DB).then((m) => {
      console.log("Database connection established");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Database connection error:", e);
  }

  return cached.conn;
}

// Auto-trigger connection on require for backward compatibility
connectDB();

module.exports = connectDB;