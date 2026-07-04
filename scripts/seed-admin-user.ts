import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import AdminUser from "@/models/AdminUser";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set."
  );
  process.exit(1);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable must be set.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 12);

  const update: Record<string, unknown> = {
    passwordHash: hashedPassword,
    name: "OpulenPort Admin",
  };

  await AdminUser.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      $setOnInsert: {
        email: ADMIN_EMAIL,
        role: "owner",
      },
      $set: update,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log("Admin user seeded successfully.");
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

void main();
