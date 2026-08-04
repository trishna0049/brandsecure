const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const DEMO = { email: "founder@startup.in", password: "password" };

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await mongoose.connection.db.collection("users").findOne({ email: DEMO.email });
  if (existing) {
    console.log("Demo user already exists:", DEMO.email);
  } else {
    const hashed = await bcrypt.hash(DEMO.password, 10);
    await mongoose.connection.db.collection("users").insertOne({ email: DEMO.email, password: hashed });
    console.log("Demo user created:", DEMO.email);
  }

  await mongoose.disconnect();
})();