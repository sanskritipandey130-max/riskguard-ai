import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI not set. Server will run in IN-MEMORY DEMO MODE " +
        "(data will not persist across restarts)."
    );
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isConnected = true;
    console.log("[db] Connected to MongoDB");
    return true;
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    console.warn("[db] Falling back to IN-MEMORY DEMO MODE.");
    return false;
  }
}

export function dbIsConnected() {
  return isConnected;
}
