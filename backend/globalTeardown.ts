import mongoose from 'mongoose';

export default async function globalTeardown() {
  // Close the mongoose connection if it's still open
  await mongoose.disconnect();

  // Check if MongoMemoryServer was used and stop it
  const mongod = (global as any).__MONGOINSTANCE;
  if (mongod) {
    await mongod.stop();
  }
}
