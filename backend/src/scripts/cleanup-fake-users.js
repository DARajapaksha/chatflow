import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

async function cleanupFakeUsers() {
  await connectDB();

  const result = await User.deleteMany({ clerkId: /^seed_/ });
  console.log(`Removed ${result.deletedCount} fake users.`);
}

cleanupFakeUsers()
  .catch((error) => {
    console.error("Failed to remove fake users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
