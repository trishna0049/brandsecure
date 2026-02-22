const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 AUTH ROUTE (IMPORTANT)
app.use("/api/auth", require("./routes/authRoutes"));

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => console.log(err));
app.use("/api/onboarding", require("./routes/onboardingRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
