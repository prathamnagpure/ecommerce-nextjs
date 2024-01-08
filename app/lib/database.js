import mongoose from "mongoose";

function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (isDatabaseConnected()) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(uri);
  }
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDatabase;
