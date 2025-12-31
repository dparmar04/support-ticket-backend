const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User.model");

mongoose.connect(process.env.MONGO_URI);

async function seedAdmin() {
  const adminExists = await User.findOne({ role: "admin" });

  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("iamadmin@123", 10);

  await User.create({
    name: "System Admin",
    email: "admin@support.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created");
  process.exit();
}

seedAdmin();
