const mongoose = require("mongoose");
require("dotenv").config(); // Load env variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Database connected successfully");
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
